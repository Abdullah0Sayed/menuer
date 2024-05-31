// import mongoose 
const mongoose = require("mongoose");

// create a schema for receipts

const receiptSchema = new mongoose.Schema({
    minimum_charge: {
        type: Number,
        default: 0
    }, 
    service: {
        type: Number,
        default: 0
    },
    vats: {
        type: Number,
        default: 0
    }, 
    taxes: {
        type: Number,
        default: 0
    },
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    }
}, {timestamps: true});

// create a model 
const receiptModel = mongoose.model('Receipt' , receiptSchema);

// exports receipt model 

module.exports = receiptModel;