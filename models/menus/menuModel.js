// import mongoose 
const mongoose = require("mongoose");

// create a schema for menu 

const menuSchema = new mongoose.Schema({
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business',
        required: true
    },
    section_id: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Sections',
            required: true
        }
    ]
} , {timestamps: true});


// create a model for menu from schema 

const menuModel = mongoose.model('Menus' , menuSchema);

// export menu model 

module.exports = menuModel;