const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const clientSchema = new mongoose.Schema({
    
    first_name: {
        type: String,
        required: [true,'first name is required'],
        lowercase: true,
        minlength: 2,
        trim: true
    },
    last_name: {
        type: String,
        required: [true,'last name is required'],
        lowercase: true,
        minlength: 2,
        trim: true
    },
    mobile: {
        type: String,
        required: [true,'password is required'],
        minlength: [11, 'inValid Mobile Number'],
        trim: true
    },
   business_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
    required: true
   },
   stuff_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
    required: true
   },
   shift_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shift',
    required: true
   }
}, { timestamps: true });



// next step > create a model from schema 

const clientModel = mongoose.model('Client', clientSchema);

module.exports = clientModel;