const asyncHandler = require("express-async-handler");
// import business model 
const businessModel = require("../../../models/business/BusinessModel");
// import sectionModel 
const sectionsModel = require("../../../models/sections/sectionModel");
// import Error Api 
const ErrorApi = require("../../../utils/Errors/errorAPI");
// import ownerItems Model 
const ownerItemsModel = require("../../../models/ownerItems/ownerItemsModel");
// import staff Model 
const staffModel = require("../../../models/staff/staffModel");
// import collections model 
const collectionModel = require("../../../models/collections/CollectionModel");
// import items Model 
const itemsModel = require("../../../models/items/itemModel")
// import Reviews Model 
const reviewModel = require("../../../models/reviews/reviewModel")

exports.getMenuSections = asyncHandler(
    async (req,res,next)=> {
        // get business id from user 
        const user_id = req.user._id;
        // console.log(user_id);
        let business_id;
        

        
        const business = await businessModel.find({user_id});
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }
        
         // fetch business id after get business model 
        if(req.business) {
            business_id = req.business._id
        }else {
            business_id = business[0]._id;
        }

        let mongooseQuery = sectionsModel.find({business_id}).populate({path: 'section_items'});
        // 5- search 
        if(req.query.keyword) {
            filterObject = {};
            filterObject.$or = [
                {section_name: {$regex: req.query.keyword , $options: 'i'}},
            ]
            mongooseQuery = mongooseQuery.find(filterObject)
        }

        // get sections related with business 
        const sections = await mongooseQuery;
        if(!sections || sections.length == 0) {
            console.log(`No Sections Created`);
        }
        req.business_id = business_id;
        res.status(200).json({sections})

       
    }
)


exports.getMenuCollectionsBasedOnCategoryId = asyncHandler(
    async(req,res,next)=>{
        // 1. get categoryID
        // get business id from user 
        const id = (req.staffInfo)? req.staffInfo._id: req.user._id;
        let business_id;
        let business
        console.log(id);

        if(req.staffInfo) {
            staff = await staffModel.findById(id);
            business_id = staff.business_id;
            business = await businessModel.findById(business_id);
            console.log(business);
        }
        else {
            business_id = req.business._id
            business = await businessModel.findById(business_id);
         }
        
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }
         // fetch business id after get business model 
        
        
         // get sections related with business 
         const sections = await sectionsModel.find({business_id}).populate({path: 'section_items'});

         // fetch business id after get business model 
         
        const category_id_array = business.categories_id;
        const collections = await collectionModel.find({category_id: {$exists: true , $in: category_id_array}}).select('collection_name')
        const items = await itemsModel.find({category_id: {$exists: true , $in: category_id_array}}).populate('collection_id').select('-item_variants -item_keywords -price -category_id')
        res.status(200).json({collections , items , sections})
        
        // get category id related with business 

    }
)


exports.addMenuSectionAndItems = asyncHandler(
    async (req,res,next)=>{
       // get business id from user 
       const id = (req.staffInfo)? req.staffInfo._id: req.user._id;
        let business_id;
        let business;

        if(req.staffInfo) {
            staff = await staffModel.findById(id);
            business_id = staff.business_id;
            business = await businessModel.findById(business_id);
            console.log(business);
        }
        else {
            business_id = req.business._id
            business = await businessModel.findById(business_id);
         }

       if(!business) {
           return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
       }
        // fetch business id after get business model 
       


        // check if find section_name
        if(req.body.section_name) {
            const newSectionObject = {
                section_name: req.body.section_name,
                business_id: business_id
            }
            const new_section = await sectionsModel.create(newSectionObject);
            res.status(200).json({new_section})
        }

        // check if find display_name or id 
        if(req.body.item_display_name || req.body.section_id || req.body.item_id) {
            const owner_item_object = {
                item_display_name: req.body.item_display_name,
                section_id: req.body.section_id,
                description: req.body.description,
                price: req.body.price,
                item_variants: {...req.body.item_variants},
                item_id: req.body.item_id,
                business_id: business_id
            }
            const new_owner_item = await ownerItemsModel.create(owner_item_object);
            const secDoc = await sectionsModel.findById(owner_item_object.section_id);
            secDoc.section_items.push(owner_item_object.item_id)
            await secDoc.save();
            res.status(200).json({new_owner_item , section: secDoc})
        }

    }
)

exports.getMenuItem = asyncHandler(
    async (req,res,next)=>{
        const item_id = req.params.id;

        const item = await ownerItemsModel.find({item_id: item_id}).populate({path: 'item_id' , select: 'item_image'}).populate({path: 'section_id' , select: 'section_name'});

        if(!item){
            return next(new ErrorApi(`No Data Exist in database for this item ${item_id}` , 404));
        }
        const reviews = await reviewModel.find({item_id: item_id}).populate({path: 'user_id' , select: 'first_name last_name'}).select('-item_id');

        res.status(200).json({item , reviews})


    }
)

exports.getItemOfSections = asyncHandler(
    async (req,res,next)=>{
        const section_id = req.params.id;

        // Create filter object
        let filterObject = { section_id: section_id };
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


        let mongooseQuery = ownerItemsModel.find({section_id: section_id});

        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            mongooseQuery = mongooseQuery.sort(sortBy)
        }

         // 5- search 
         if(req.query.keyword) {
            filterObject = {};
            filterObject.$or = [
                {item_display_name: {$regex: req.query.keyword , $options: 'i'}},
                {description: {$regex: req.query.keyword , $options: 'i'}},
            ]
            mongooseQuery = mongooseQuery.find(filterObject)
        }


        const items = await mongooseQuery;

        if(!items) {
            return next(new ErrorApi(`No items founded in database for this section ${section_id}`));
        }

        res.status(200).json({items})
    }
)