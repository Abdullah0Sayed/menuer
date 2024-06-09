const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const clientSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowerCase: true
    }
    ,
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
        required: [true,'mobile is required'],
        minlength: [11, 'inValid Mobile Number'],
        trim: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user']
    },
    password: {
        type: String,
        default: 'menuer@2024'
    },
    passwordChangedAt: {
        type: Date
    }
    ,
    resetPasswordHashedCode: String,
    resetPasswordExpiration: Date,
    resetPasswordVerification: Boolean,
   business_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Business',
   },
   stuff_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
   },
   shift_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'Shift',
   },
   wishlists: [
    {
        type: mongoose.Schema.ObjectId,
        ref: 'ownerItems'
    }
   ]
}, { timestamps: true });


// hashing password using mongoose middleware 
clientSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    // hashing for password 
    this.password = await bcrypt.hash(this.password , 12);
    next();
})



// next step > create a model from schema 

const clientModel = mongoose.model('Client', clientSchema);

module.exports = clientModel;