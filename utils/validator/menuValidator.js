// import validation middleware 
const validationMiddleware = require("../../middlewares/validations/MiddlewareValidation");
// import check from express-validator
const { check } = require("express-validator");


exports.createMenuValidator = [
    check('business_id').notEmpty().withMessage(`Business ID is Required`).isMongoId().withMessage("Business ID is Not Valid ID"),
    check('section_id').isArray({min: 1}).withMessage('Menu Must Contain at Least One Section').isMongoId().withMessage(`Section ID is Not Valid ID`),
    validationMiddleware
]


exports.getMenuValidator = [
   check(`id`).isMongoId().withMessage(`Menu id is Not Valid ID`),
    validationMiddleware
]
