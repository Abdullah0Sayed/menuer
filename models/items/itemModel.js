// import mongoose 
const mongoose = require("mongoose");

// create a Item Schema 
const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }, 
    item_image: {
        type: String,
        required: true
    },
    item_variants: {
        type: Map,
        of: String
    },
    item_description: {
        type: String,
        lowercase: true,
        trim: true
    },
    item_keywords: {
        type: [String],
        lowercase: true,
        trim: true
    },
    price: {
        type: String,
        default: 0
    },
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories',
        required: true
    }, 
    collection_id:{
        type: mongoose.Schema.ObjectId,
        ref: 'Collections',
    }
} , {timestamps: true});


const returnImageUrlOnResponse = (doc)=>{
    if(doc.item_image) {
        const img_url = `${process.env.BASE_URL}/items/${doc.item_image}`;
        doc.item_image = img_url 
    }
   
};


itemSchema.post('init' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


itemSchema.post('save' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


// create a item model 
const itemModel = mongoose.model('Items' , itemSchema);

// export a item model 

module.exports = itemModel;