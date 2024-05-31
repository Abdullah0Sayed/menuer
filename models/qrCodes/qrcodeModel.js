// import mongoose 
const mongoose = require("mongoose");

// create a schema for qrCode 
const qrCodeSchema = new mongoose.Schema({
    qr_image: {
        type: String,
        require: true,
    }, 
    menu_id: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
} , {timestamps: true});

// create a model for qrCodes From qrSchema 
const qrCodeModel = mongoose.model('qrCodes' , qrCodeSchema);

// exports model 

module.exports = qrCodeModel;