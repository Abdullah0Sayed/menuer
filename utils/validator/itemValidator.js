// import check from express-validator 
const { check } = require("express-validator");
// import validation middleware 
const MiddlewareValidation = require("../../middlewares/validations/MiddlewareValidation");
// import category Model 
const categoryModel = require("../../models/categories/categoryModel");
// import collections model 
const collectionModel = require("../../models/collections/CollectionModel");
const ErrorApi = require("../Errors/errorAPI");


exports.createItemValidator = [
    check('item_name').notEmpty().withMessage('Item Name is Required'),
    check('item_image').notEmpty().withMessage('Item Image is Required'),
    check('category_id').notEmpty().withMessage('category id is required').isMongoId().withMessage('Category ID is Not Valid ID').custom(async (category_id)=>{
      // get category model 
      try {
        const category = await categoryModel.find({_id: category_id});
        if(category.length == 0) {
          return Promise.reject(new Error(`No Category Matching This ID in database ${category_id}`))
        }
      } catch (error) {
        console.log(error);
      }
    
    }),
    check('collection_id').optional().isMongoId().withMessage('Collection ID is Not Valid ID').custom(async(collection_id , {req})=>{
     if(collection_id) {
      try {
        let category_id ;
        if(req.body.category_id) {
          category_id = req.body.category_id;
          const category = await categoryModel.find({_id: category_id});
          if(category.length == 0) {
            return Promise.reject(new Error(`No Category Matching This ID in database ${category_id}`))
          }
        }
        
        const collection = await collectionModel.find({_id: collection_id});
        if(collection.length == 0) {
          return Promise.reject(new Error(`No collection Matching This ID in database ${collection_id}`))
        }
        const categoryIdOfCollection = collection[0].category_id;
        if(category_id != categoryIdOfCollection) {
          // console.log(`category id stored for collection != category id in request`);
          return Promise.reject(new Error(`collection id doesn't belong to this category id ${category_id}`))
        }
        
        
       
       
      } catch (error) {
        
      }
     }
    }),
    MiddlewareValidation
]

exports.updateItemValidator = [
    check('id').notEmpty().withMessage('Item ID is Required').isMongoId().withMessage(`Item ID is Not Valid ID`),
    check('item_name').optional(),
    check('item_image').optional().notEmpty().withMessage(`Item Image Must Be Filled`),
    check('category_id').optional().notEmpty().withMessage(`category_id Must Be Filled`).isMongoId().withMessage(`Category ID is Not Valid ID`),
    check('collection_id').optional().isMongoId().withMessage(`Collection ID is Not Valid ID`),
    MiddlewareValidation
]

exports.getItemValidator = [
  check('id').isMongoId().withMessage('Item ID is Not Valid ID'),
    MiddlewareValidation
]


exports.deleteItemValidator = [
  check('id').isMongoId().withMessage('Item ID is Not Valid ID'),
    MiddlewareValidation
]