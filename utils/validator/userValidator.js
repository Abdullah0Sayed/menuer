const {check , req} = require("express-validator");
const bcrypt = require("bcrypt")

const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");
const UserModel = require("../../models/users/userSignUpModel");
const ErrorApi = require("../Errors/errorAPI");


exports.addNewUserValidation = [
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


exports.updateUserValidation = [
    check('email').optional().isEmail().withMessage('Email is Not Valid Email').custom(async (email)=>{
        try {
            const user = await UserModel.findOne({email});
            if(user) {
                return Promise.reject(new ErrorApi(`E-Mail is already exists`))
            }
        } catch (error) {
            console.log(error);
        }
       
    }),
    check('first_name').optional(),
    check('last_name').optional(),
    check('active').optional()
    ,MiddlewareValidation
]

exports.getUserValidation = [
    check('id').isMongoId().withMessage(`This Id is InValid`),
    MiddlewareValidation
]


exports.changePasswordValidation = [
    check('newPassword').notEmpty().withMessage(`New Password Must Be Filed`).custom(async(pass , {req} )=>{
        try {
              // 1- verify current password 
            const user = await UserModel.findById(req.params.id);
            if(!user) {
                return Promise.reject(new Error(`No User Founded`))
            }
            const checkVerificationPassword = await bcrypt.compare(req.body.currentPassword , user.password);
            if(!checkVerificationPassword) {
                return Promise.reject(new Error(`Incorrect Password`))
            }
            // 2- verify confirm with new password
            if(pass !== req.body.confirmPassword) {
                return Promise.reject(new Error(`Password Confirmation Doesn't Matching Password`));
            }
        } catch (error) {
            console.log(error);
        }
      
    }),
    check('currentPassword').notEmpty().withMessage(`Current Password Must Be Filled`),
    check('confirmPassword').notEmpty().withMessage(`Confirm Password Must Be Filled`)
    ,MiddlewareValidation
]