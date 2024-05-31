// import validation middleware 
const validationMiddleware = require("../../middlewares/validations/MiddlewareValidation");
// import check from express validator 
const { check  , param} = require("express-validator");
// import business model 
const businessModel = require("../../models/business/BusinessModel");
const ErrorApi = require("../Errors/errorAPI");
const sectionModel = require("../../models/sections/sectionModel");


exports.createSectionValidator = [
    check('section_name').isLength({min: 2}).withMessage(`Section Name Length Must Be Greater Than 2 Character`),
    check('section_items').optional().isMongoId().withMessage(`Section Items IDs Not Valid Id`),
    check('business_id').optional().isMongoId().withMessage(`Business ID is NotValid ID`).custom(async(business_id , {req})=>{
        try {
             // get business id from user logged 
                const user_id = req.user._id;
                // get Business if of user logged
                const business = await businessModel.findOne({user_id: user_id});
                if(!business) {
                    return next(new ErrorApi(`${req.user.first_name} doesn't have Any Business - Create Business Now` , 204));
                }
                const business_id = business._id;
                req.body.business_id = business_id;

        } catch (error) {
            console.log(error);
        }
    }),
    validationMiddleware
]


exports.updatedSectionValidator = [
    check('id').isMongoId().withMessage('Section ID is Not Valid ID'),
    check('section_name').optional(),
    check('section_items').optional().isMongoId().withMessage(`Section Items IDs Not Valid Id`),
    check('business_id').optional().isMongoId().withMessage(`Business ID is NotValid ID`),
    validationMiddleware
]

exports.getSectionValidator = [
    check('id').isMongoId().withMessage('Section ID is Not Valid ID'),
    validationMiddleware
]

exports.deleteSectionValidator = [
    check('id').isMongoId().withMessage('Section ID is Not Valid ID'),
    validationMiddleware
]