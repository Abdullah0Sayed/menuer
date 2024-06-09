// import mongoose 
const mongoose = require("mongoose");

// create a Schema For Sections 
const sectionSchema = new mongoose.Schema({
    section_name: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        default: "my-section"
    }, 
    section_items: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'ownerItems',
        },
    ],
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
    }, 

} , {timestamps: true});


// create a model from section schema 
const sectionModel = mongoose.model('Sections' , sectionSchema);

// export section model 

module.exports = sectionModel;