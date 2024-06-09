// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import reviewModel 
const reviewModel = require("../../models/reviews/reviewModel");
// import reviewModel 
const clientModel = require("../../models/clients/clientsModel");
// import errorApi
const ErrorApi = require("../../utils/Errors/errorAPI");
// import factoryController 
const factory = require("../factoryController");

exports.createReview = asyncHandler(
    async (req,res,next)=>{
        const client_id = req.user._id;
        let business_id = (req.body.business_id) ? req.body.business_id : undefined;
        const reviewObject = {
            comment: req.body.comment,
            client_id: client_id,
            item_id: req.body.item_id,
            ratings: req.body.ratings,
            business_id: business_id
        }
        const newReview = await reviewModel.create(reviewObject);
        res.status(201).json({newReview});
    }
)

exports.deleteReview = factory.deleteDoc(reviewModel)