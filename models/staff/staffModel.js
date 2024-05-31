// import mongoose 
const mongoose = require("mongoose");

// create schema for staff 

const staffSchema = new mongoose.Schema({
    staff_email: {
        type: String,
        required: true,
        lowerCase: true,
        trim: true,
        unique: true
    },
    job_title: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true
    },
    allowed_pages: {
        type: [String],
        required: true,
        enum: ["1" , "2" , "3" , "4" , "5"]
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    }
} , {timestamps: true});


// create a model for staff 

const staffModel = mongoose.model('Staff' , staffSchema);

// exports staff model 

module.exports = staffModel;