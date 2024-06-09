// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import business Model 
const businessModel = require("../../../models/business/BusinessModel");
// import owner items
const ownerItemsModel =  require("../../../models/ownerItems/ownerItemsModel");


// @desc  Get All Owner Items 
// @route
// @access

exports.getOwnerItemsAndBusiness = asyncHandler(
    async(req,res,next)=>{
        const ownerItems = await ownerItemsModel.find().sort('-createdAt');
        const business = await businessModel.find().limit(3)
        res.status(200).json({featuredTodayItems:ownerItems  , trendingBusiness: business , msg: 'All Home Data is Returned Successfully' , status: 'success'});
    }
)

