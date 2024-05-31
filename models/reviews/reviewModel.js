// import mongoose 
const mongoose = require("mongoose");

// create modelSchema
const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    likes: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    item_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Items'
    }
} , {timestamps: true});

const reviewModel = mongoose.model('review' , reviewSchema);

module.exports = reviewModel;