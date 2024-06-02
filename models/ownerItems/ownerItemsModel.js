// import mongoose 
const mongoose = require("mongoose");

// create schema 

const ownerItemsMongooseSchema = new mongoose.Schema({
    item_display_name: {
    type: String,
    },
    section_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Sections',
        required: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
    },
    item_variants: {
        type: Map,
        of: String
    },
    item_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Items'
    },
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    }

} , {timestamps: true});

// owner items model 
const ownerItemsModel = mongoose.model('ownerItems' , ownerItemsMongooseSchema);

module.exports = ownerItemsModel;