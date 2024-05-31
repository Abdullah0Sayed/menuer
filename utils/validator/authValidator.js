const {check , req} = require("express-validator");
const bcrypt = require("bcrypt")

const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");
const UserModel = require("../../models/users/userSignUpModel");
const ErrorApi = require("../Errors/errorAPI");

exports.signupValidator = [
    check('email').notEmpty().withMessage('Email Must Be Filled').isEmail().withMessage('Email is Not Valid').custom(async (email)=>{
        try {
            const user = await UserModel.findOne({email});
            if(user) {
                return Promise.reject(new ErrorApi(`E-Mail is already exists`))
            }
        } catch (error) {
            console.log(error);
        }
       
    }),
    check('first_name').notEmpty().withMessage('first Name is Required'),
    check('last_name').notEmpty().withMessage('last Name is Required'),
    check('password').notEmpty().withMessage('Password Must Be Filled').custom(async (pass , {req}) => {
        try {
            if(pass !== req.body.confirmPassword) {
                return Promise.reject(new ErrorApi(`Password Confirmation Doesn't Matching Password` , 400));
            }
        } catch (error) {
            console.log(error);
        }
    }),
    check('confirmPassword').notEmpty().withMessage(`Password Confirmation Must Be Filled`),
    MiddlewareValidation
]

exports.loginValidator = [
    check('email').notEmpty().withMessage('Email Must Be Filled').isEmail().withMessage('Email is Not Valid'),
    check('password').notEmpty().withMessage('Password Must Be Filled'),

    MiddlewareValidation
]