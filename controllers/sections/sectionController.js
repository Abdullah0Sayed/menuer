// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import Section Model 
const sectionModel = require("../../models/sections/sectionModel");
// import ErrorApi 
const ErrorApi = require("../../utils/Errors/errorAPI");
// import factory 
const {deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../factoryController");
const businessModel = require("../../models/business/BusinessModel");

// @desc -> create a new section 
// route -> POST / menus/create-section
// access -> Private 

exports.createSection = asyncHandler(
    async (req,res,next)=>{
       
        const new_section = await sectionModel.create(req.body);
        res.status(201).json(new_section)
        // console.log(`User Id From Section Creation ${user_id}`);
        // console.log(`Business Id From Section Creation ${business_id}`);
    }
)


// @desc -> create a new section 
// route -> PUT / menus/update-section/:id
// access -> Private 
exports.updateSection = updateDoc(sectionModel)


// @desc -> get all sections
// route -> GET / menus/sections
// access -> Private 

exports.getAllSections = getAllDocs(sectionModel)

// @desc -> get a specific section 
// route -> GET / menus/get-section/:id
// access -> Private 

exports.getSection = getDoc(sectionModel)

// @desc -> get a specific section 
// route -> GET / menus/get-section/:id
// access -> Private 

exports.getSectionsOfBusiness = asyncHandler(
    async (req,res,next)=>{
        // get business id from user logged 
        const user_id = req.user._id;
        // get Business if of user logged
        const business = await businessModel.findOne({user_id: user_id});
        if(!business) {
            return next(new ErrorApi(`${req.user.first_name} doesn't have Any Business - Create Business Now` , 204));
        }
        const business_id = business._id;

        const sections = await sectionModel.find({business_id: business_id});
        res.status(200).json({sections})
    }
)

// @desc -> delete a specific section 
// route -> DELETE / menus/delete-section/:id
// access -> Private  

exports.deleteSection = deleteDoc(sectionModel)