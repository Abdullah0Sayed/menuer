const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSignUpSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        required: [true,'email name is required'],
        unique: [true, 'email must be unique'],
        trim: true
    },
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
    password: {
        type: String,
        required: [true,'password is required'],
        minlength: [12, 'too Short Password'],
        trim: true
    },
    role: {
        type: String, 
        enum: ["owner" , "stuff" , "customer" , "admin"] , 
        default: "customer"
    },
    active: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date
    }
    ,
    resetPasswordHashedCode: String,
    resetPasswordExpiration: Date,
    resetPasswordVerification: Boolean,
    
}, { timestamps: true });

// hashing password using mongoose middleware 
userSignUpSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) {
        return next();
    }

    // hashing for password 
    this.password = await bcrypt.hash(this.password , 12);
    next();
})


// next step > create a model from schema 

const userSignUpModel = mongoose.model('User', userSignUpSchema);

module.exports = userSignUpModel;