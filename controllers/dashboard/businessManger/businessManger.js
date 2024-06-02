const asyncHandler = require("express-async-handler");
// import business model 
const businessModel = require("../../../models/business/BusinessModel");
// import user model 
const userModel = require("../../../models/users/userSignUpModel");
// import staff model 
const staffModel = require("../../../models/staff/staffModel");
// import receipt model 
const receiptModel = require("../../../models/receipt/receiptModel");
// import sectionModel 
const sectionsModel = require("../../../models/sections/sectionModel");
// import Error Api 
const ErrorApi = require("../../../utils/Errors/errorAPI");

// import multer for business logo 
const multer = require("multer");
// import uuid 
const {v4: uuidv4} = require("uuid")
// import sharp
const sharp = require("sharp");
// configuration of multer 
const multerStorage = multer.memoryStorage();
const multerFilter = function(req,file,cb) {
    
    
        if(file.mimetype.startsWith("image")) {
        cb(null , true)
        }
        else {
            cb(new ErrorApi(`business logo File Not Image , Please Upload Image` , 400) , false)

        }
    
}
const upload = multer({storage: multerStorage , fileFilter: multerFilter});

exports.uploadBusinessImages = upload.fields([
    {name: 'business_logo' , maxCount: 1}
     , 
     {name: 'business_cover' , maxCount: 1}
    ]);

exports.resizeUploadBusinessImages = asyncHandler(
    async(req,res,next) => {
        // console.log(req.files);
        console.log(req.files);
        if(req.files) {
            if(req.files.business_cover) {
                const cover_file_name = `bsCover-${uuidv4()}-${Date.now()}.png`;
    
                await sharp(req.files.business_cover[0].buffer).resize(1110,260).toFormat("png").png({quality: 95}).toFile(`uploads/business/covers/${cover_file_name}`);
                req.body.business_cover = cover_file_name
            }
    
            if(req.files.business_logo) {
                const logo_file_name = `bsLogo-${uuidv4()}-${Date.now()}.png`;
    
                await sharp(req.files.business_logo[0].buffer).resize(500,500).toFormat("png").png({quality: 95}).toFile(`uploads/business/logos/${logo_file_name}`);
                req.body.business_logo = logo_file_name
                next();
               
            }
    
        }
        next();
        
    }
)


exports.getBusinessGeneralDetails = asyncHandler(
    async (req,res,next)=>{
        const user_id = req.user._id;
        console.log(user_id);
        const business = await businessModel.find({user_id}).select('business_name business_slogan business_logo business_cover');
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }
         // fetch business id after get business model 
        const business_id = business[0]._id;
        res.status(200).json({business})

    }
)

exports.updateGeneralBusinessDetails = asyncHandler(
    async (req,res,next)=>{
        const user_id = req.user._id;
        console.log(user_id);
        const business = await businessModel.find({user_id})
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }
        const business_id = business[0]._id;    
        console.log(business_id);
        const update_business_general_details_object = {
            business_name: req.body.business_name || business.business_name,
            business_slogan: req.body.business_slogan || business.business_slogan,
            business_logo: req.body.business_logo,
            business_cover: req.body.business_cover
        }
        const new_business = await businessModel.findByIdAndUpdate({_id: business_id} , update_business_general_details_object , {new: true})
       
         // fetch business id after get business model 
        
       
        res.status(200).json({new_business})

    }
)

exports.getBusinessContactDetails = asyncHandler(
    async (req,res,next)=>{
        const user_id = req.user._id;
        console.log(user_id);
        const business = await businessModel.find({user_id}).select('business_address business_mobile business_social_media');
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }
         // fetch business id after get business model 
        const business_id = business[0]._id;
        res.status(200).json({business})

    }
)


exports.updateContactBusinessDetails = asyncHandler(
    async (req,res,next)=>{
        const user_id = req.user._id;
        console.log(user_id);
        const business = await businessModel.find({user_id: user_id});
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
            }

            const business_id = business[0]._id;

       
        const new_business = await businessModel.findById(business_id);

        new_business.business_address.push(req.body.business_address);
        new_business.business_mobile.push(req.body.business_mobile);
        new_business.business_social_media.push(req.body.business_social_media);
        await new_business.save();
         // fetch business id after get business model 
        
       
        res.status(200).json({new_business})

    }
)

exports.addNewStaffMember = asyncHandler(
    async (req,res,next)=>{

        const inputEmail = req.body.email;
        // get user based on id 
        const user = await userModel.findOne({email: inputEmail});
        if(!user) {
            return next(new ErrorApi(`no user founded in database for this email: ${inputEmail}` , 404));
        }
        console.log(user);

        const business = await businessModel.findById(req.business._id);
        if(!business) {
            return next(new ErrorApi(`no business founded in database for this user: ${req.user.first_name}` , 404));
        }

        const newStaffMemberObject = {
            staff_email: user.email,
            job_title: req.body.job_title,
            allowed_pages: [...req.body.allowed_pages],
            user_id: user._id, 
            business_id: business._id
        } 

        const new_staff = await staffModel.create(newStaffMemberObject);
        user.role = 'stuff';
        await user.save()
        res.status(201).json({data: new_staff , status: 'success' ,msg: 'user not found'})
    }
)

exports.getStaffMembers = asyncHandler(
    async (req,res,next)=>{
        // get business id 
        const business_id = req.business._id;
        

         // Create filter object
         let filterObject = { business_id: business_id };
         let queryStringObject = { ...req.query };
 
         // Exclude fields from query
         const excludeFromQuery = ['sort', 'limit', 'fields', 'keyword'];
         excludeFromQuery.forEach(ele => {
             delete queryStringObject[ele];
         });
 
         // Convert query object to MongoDB operators
         queryStringObject = JSON.stringify(queryStringObject).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
         const queryObject = JSON.parse(queryStringObject);
 
         // Merge filterObject with queryObject
         filterObject = { ...filterObject, ...queryObject };
 

        let mongooseQuery = staffModel.find(filterObject).populate({path: 'user_id', select: 'first_name last_name'});
        
        //  3- sorting sort('price -item_name')
         if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            mongooseQuery = mongooseQuery.sort(sortBy)
        }

         // 5- search 
         if(req.query.keyword) {
            filterObject = {};
            filterObject.$or = [
                {staff_email: {$regex: req.query.keyword , $options: 'i'}},
                {job_title: {$regex: req.query.keyword , $options: 'i'}},
            ]
            mongooseQuery = mongooseQuery.find(filterObject)
        }
        
        let staffs = await mongooseQuery;

        if(!staffs && staffs.length == 0) {
            return next(new ErrorApi(`no staffs For (${req.business.business_name}) Business` , 404));
        }
       

        res.status(200).json({staffs})
        // console.log(staffs);
    }
)


exports.getReceiptSetting = asyncHandler(
    async (req,res,next)=>{
        // get business ID 
        const business_id = req.business._id;
        console.log(business_id);
        // check if business has receipt setting
        const receipt = await receiptModel.findOne({business_id: business_id});

        if(!receipt) {
           return next(new ErrorApi(`no receipt founded for this business ${req.business.business_name}` , 404))
        }

        res.status(200).json({receipt});
    }
)
exports.setReceiptSetting = asyncHandler(
    async (req,res,next)=>{
        // get business ID 
        const business_id = req.business._id;
        console.log(business_id);
        // check if business has receipt setting
        req.body.business_id = business_id;
        const receipt = await receiptModel.create(req.body);

        res.status(201).json({receipt});
    }
)