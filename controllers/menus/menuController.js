// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import menu model 
const menuModel = require("../../models/menus/menuModel");
// import ErrorApi 
const ErrorApi = require("../../utils/Errors/errorAPI");
// import Business Model
const businessModel = require("../../models/business/BusinessModel");
// import factory 
const {deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../factoryController")

// @desc -> create a new menu 
// route -> POST / menus/create-menu
// access -> Private 

exports.createMenu = createNewDoc(menuModel)


// @desc -> get a menu 
// route -> GET / menus/create-menu
// access -> Private 

exports.getMenu = getDoc(menuModel)


// @desc -> get MENUS 
// route -> GET / menus/
// access -> Private 

exports.getMenus = getAllDocs(menuModel)


// @desc -> update menu by id 
// route -> PUT / menus/edit-menu
// access -> Private 

exports.updateMenu = updateDoc(menuModel)

// @desc -> update menu by id 
// route -> PUT / menus/edit-menu
// access -> Private 

exports.deleteMenu = deleteDoc(menuModel)


// @desc -> nested route for get menu by business id 
// route -> PUT / business/:business_id/menu
// access -> Private 

exports.getMenuOfBusiness = asyncHandler(
    async (req , res , next) => {
        const business_id = req.params.id;

        const menus = await menuModel.find({business_id: business_id}).populate({path: 'section_id'}).populate({path: 'business_id' , select: 'business_name'});;

        if(menus.length == 0) {
            return next(new ErrorApi(`No Menus Founded For This Business ID` , 400));
        }
        res.status(200).json({data: menus , length: menus.length});
    }
)