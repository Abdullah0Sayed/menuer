// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import reviewModel 
const reviewModel = require("../../models/reviews/reviewModel");
// import errorApi
const ErrorApi = require("../../utils/Errors/errorAPI");

exports.createReview = asyncHandler(
    async (req,res,next)=>{
        const newReview = await reviewModel.create(req.body);
        res.status(201).json({newReview});
    }
)