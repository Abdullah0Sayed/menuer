// import mongoose 
const mongoose = require("mongoose");

// create a schema 
const shiftSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        required: true
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now()
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
    transactions: {
        type: Number,
        default: 0
    }
    ,
    stuff_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Staff'
    },
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    }
    } , {timestamps: true});
    
    
    
    // mongoose middleware

    shiftSchema.pre(/^find/, function(next) {
        this.populate('stuff_id business_id');
        next();
      });
      


    // create a model for shift 

    const shiftModel = mongoose.model('Shift' , shiftSchema);





    // exports a shit model 
    
    module.exports = shiftModel;