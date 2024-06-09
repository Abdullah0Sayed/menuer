// import mongoose 
const mongoose = require("mongoose");

// create a schema for qrCode 
const qrCodeSchema = new mongoose.Schema({
    qr_image: {
        type: String,
        require: true,
    }, 
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    },
    qr_content: {
        type: String,
    }
} , {timestamps: true});



const returnImageUrlOnResponse = (doc)=>{
    if(doc.qr_image) {
        const img_url = `${process.env.BASE_URL}/items/${doc.qr_image}`;
        doc.qr_image = img_url 
    }
   
};


qrCodeSchema.post('init' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


qrCodeSchema.post('save' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


// create a model for qrCodes From qrSchema 
const qrCodeModel = mongoose.model('qrCodes' , qrCodeSchema);

// exports model 

module.exports = qrCodeModel;