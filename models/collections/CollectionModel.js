const mongoose = require("mongoose");

// create a collection schema 
const collectionSchema = new mongoose.Schema({
    collection_name: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true , 
        trim: true
    }, 
    category_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories',
        required: true
    }
} , {timestamps: true});

// create a model from schema 

const CollectionModel = mongoose.model('Collections',collectionSchema);

// export collection model 

module.exports = CollectionModel;