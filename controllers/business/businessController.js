// import [1] AsyncHandler to fetch any error in async .. await 
const asyncHandler = require("express-async-handler");
// import multer for business logo 
const multer = require("multer");
// import uuid 
const {v4: uuidv4} = require("uuid")
// import sharp
const sharp = require("sharp");
// import [2] Business Model 
const businessModel = require("../../models/business/BusinessModel");
// import [3] User Model 
const userModel = require("../../models/users/userSignUpModel");
// import [3] Error Class Api
const ErrorApi = require("../../utils/Errors/errorAPI");
// import factory 
const {deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../factoryController")

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
        console.log(`Files`);
        // console.log(req.files);
        
       
            if(req.files.business_cover) {
                const cover_file_name = `bsCover-${uuidv4()}-${Date.now()}.png`;
    
                await sharp(req.files.business_cover[0].buffer).resize(1110,260).toFormat("png").png({quality: 95}).toFile(`uploads/business/covers/${cover_file_name}`);
                req.body.business_cover = cover_file_name
            }
    
            if(req.files.business_logo) {
                const logo_file_name = `bsLogo-${uuidv4()}-${Date.now()}.png`;
    
                await sharp(req.files.business_logo[0].buffer).resize(500,500).toFormat("png").png({quality: 95}).toFile(`uploads/business/logos/${logo_file_name}`);
                req.body.business_logo = logo_file_name
                
            }

        
        next();
        
    }
)


// @desc create a new business 
// @route POST /business/create/
// @access private
exports.createBusiness = asyncHandler(
    async (req, res) => {
        req.body.user_id = req.user._id;
        const newDoc = await businessModel.create(req.body);
        // get user 
        const user = await userModel.findOne({_id: req.user._id});
        user.role = 'owner';
        await user.save();
        res.status(201).json({data: newDoc});
    }
)

// @desc get a business by ID
// @route GET /business/:ID
// @access private
exports.getBusiness = getDoc(businessModel)

// @desc get a ALL Business
// @route GET /business
// @access private
exports.getAllBusiness = getAllDocs(businessModel)


// @desc update a Business by ID
// @route PUT /business/:ID
// @access private

exports.updateBusiness = updateDoc(businessModel)

// @desc delete a Business by ID
// @route DELETE /business/:ID
// @access private

exports.deleteBusiness = deleteDoc(businessModel)

// @desc delete a Business by ID
// @route DELETE /business/:ID
// @access private
exports.deleteAllBusinessOnUser = asyncHandler(
    async (req,res,next) => {
        const user_id = req.params.user_id;
        const business = await businessModel.deleteMany({"user_id" : user_id});
        
        res.status(200).json({msg: `All Business Deleted Successfully`});
    }
)