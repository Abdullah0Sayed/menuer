// import middleware method from middlewares 
const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");
// import check from express-validator 
const { check , param } = require("express-validator");
// import Category Model 
const CategoryModel = require("../../models/categories/categoryModel");
// import ErrorApi From Middleware 
const ErrorApi = require("../Errors/errorAPI");


// create a validator of create a collection 
exports.createCollectionValidator = [
    check('collection_name').notEmpty().withMessage('Collection Name is Required'),
    check('category_id').isMongoId().withMessage(`Category ID inValid ID`).custom(
        async (category_id) => {
            try {
                const category = await CategoryModel.findById({_id: category_id});
                if(!category) {
                    return Promise.reject(new ErrorApi(`No Category Matching This ID ${category_id} in database` , 400));
                }
            } catch (error) {
                console.log(error);
            }
    }),
    MiddlewareValidation
]


// create a validator of create a collection 
exports.getCollectionValidator = [
   
    param('id').isMongoId().withMessage(`Collection ID inValid ID`),
    MiddlewareValidation
]
exports.deleteCollectionValidator = [
   
    param('id').isMongoId().withMessage(`Collection ID inValid ID`),
    MiddlewareValidation
]

// create a validator of create a collection 
exports.updatedCollectionValidator = [
   
    param('id').isMongoId().withMessage(`Collection ID inValid ID`),
    check('collection_name').notEmpty().withMessage(`Collection Name is Required`),
    check('category_id').optional().isMongoId().withMessage(`Category ID inValid ID`).custom(
        async (category_id) => {
            if(category_id) {
                try {
                    const category = await CategoryModel.findById({_id: category_id});
                    if(!category) {
                        return Promise.reject(new ErrorApi(`No Category Matching This ID ${category_id} in database` , 400));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            
    }),
    MiddlewareValidation
]

// create a validator of create a collection 
exports.getCollectionsOfCategoryValidator = [
   
    param('id').isMongoId().withMessage(`Category ID inValid ID`).custom(async (category_id)=>{
        try {
            const categoryID = category_id;
            console.log(categoryID);
            
            const category = await CategoryModel.findById(categoryID);
            if(!category) {
                return Promise.reject(new ErrorApi(`No Category in database Related With This ID: ${categoryID}`))
            }
           
        } catch (error) {
            console.log(error);
        }
    }),
    MiddlewareValidation
]