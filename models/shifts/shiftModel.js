// import mongoose 
const mongoose = require("mongoose");

// create a schema 
const shiftSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        require: true
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    endedAt: {
        type: Date
    },
    cashIn: {
        type: Number,
        default: 0
    },
    cashOut: {
        type: Number,
        default: 0,
    },
    currentCash: {
        type: Number,
        default: 0
    },
    stuff_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Staff'
    }
    } , {timestamps: true});
    
    
    // create a model for shift 

    const shiftModel = mongoose.model('Shift' , shiftSchema);

    // exports a shit model 
    
    module.exports = shiftModel;