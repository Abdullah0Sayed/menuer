const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");
const {check , param} = require("express-validator");
const CategoryModel = require("../../models/categories/categoryModel");
const UserModel = require("../../models/users/userSignUpModel");
const ErrorApi = require("../Errors/errorAPI");
const businessModel = require("../../models/business/BusinessModel");

exports.createBusinessValidation = [
    check('business_name').notEmpty().withMessage('Business Name is Required').isLength({min: 2}).withMessage('Business Name Must Be Greater Than Two Character').custom(async(value , {req}) => {

      try {
        const user_id = req.user._id;
        console.log(`user id from Business Validator ${user_id}`);
        const business = await businessModel.find({user_id : user_id});
        console.log(business.length);
        if(business.length >= 1) {
            return Promise.reject(new Error(`There Are One Business Created For ${req.user.first_name}`))
        }
        
      } catch (error) {
          console.log(error);
      } 
      
    }),
    check('business_slogan').isLength({min: 4}).withMessage('Business Slogan Must be Greater Than Four Character'),
    check('business_mobile').isMobilePhone("ar-EG").withMessage('invalid Egyptian Mobile Phone'),
    check('categories_id').isMongoId().withMessage(`inValid Categories ID`).custom(
        async (categoriesIdsArray) => {
          try {
            
            const result = await CategoryModel.find({ _id: { $exists: true, $in: categoriesIdsArray } });
          
            let tmp_categories_array = categoriesIdsArray.toString().split(",");
           
            console.log(`Documents Returned Length : ` + result.length);
            console.log(`Array Entered Length : ` + tmp_categories_array.length);
            if (tmp_categories_array.length !== result.length || result.length < 1) {
              console.log(`Promise Rejected !! `);
              return Promise.reject(new ErrorApi(`No Categories Matching This Ids`, 400));
            }
            else {
              console.log(result);
            }
          } catch (err) {
            console.log(err);
          }
        }
      ),

    MiddlewareValidation
]

// ----------------------------------------------------------------------
exports.getBusinessValidation = [
    check('id').isMongoId().withMessage('Business ID is Not Valid'),


    MiddlewareValidation
]


// ----------------------------------------------------------------------

exports.updateBusinessValidation = [
    check('id').isMongoId().withMessage('Business ID is Not Valid ID'),
    check('business_name').optional().isLength({min: 2}).withMessage('Business Name Must Be Greater Than Two Character'),
    check('business_slogan').optional().isLength({min: 4}).withMessage('Business Slogan Must be Greater Than Four Character'),
    check('business_mobile').optional().isLength({min:11}).withMessage('mobile Phone Must not be less than 11 Number').isLength({max: 11}).withMessage('inValid Mobile Phone'),
    check('user_id').optional().isMongoId().withMessage('User ID not valid id'),
    check('categories_id').optional().isMongoId().withMessage('category ID not valid id'),


    MiddlewareValidation
]

// ----------------------------------------------------------------------
exports.deleteBusinessValidation = [
    check('id').isMongoId().withMessage('Business ID is Not Valid'),


    MiddlewareValidation
]



// ----------------------------------------------------------------------
exports.deleteAllBusinessOnUserValidation = [
    check('id').isMongoId().withMessage('user ID is Not Valid'),


    MiddlewareValidation
]









