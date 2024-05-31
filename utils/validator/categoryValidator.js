const {check} = require("express-validator");
const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");


exports.addCategoryValidation = [
    check('category_name').isLength({min: 1}).withMessage(`Name Length Not Valid`),
    MiddlewareValidation
]

exports.getCategoryValidation = [
    check('id').isMongoId().withMessage(`ID is inValid`),
    MiddlewareValidation
]

exports.updatedCategoryValidation = [
    check('id').isMongoId().withMessage(`ID is inValid`),
    check('category_name').isLength({min: 1}).withMessage(`Name Length Not Valid`),
    MiddlewareValidation
]

exports.deleteCategoryValidation = [
    check('id').isMongoId().withMessage(`ID is inValid`),
    MiddlewareValidation
]