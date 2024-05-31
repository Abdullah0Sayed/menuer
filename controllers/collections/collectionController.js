// import model 
const collectionModel = require("../../models/collections/CollectionModel");
// import async handler 
const asyncHandler = require("express-async-handler");
// import error api 
const ErrorApi = require("../../utils/Errors/errorAPI");
// import category Model 
const categoryModel = require("../../models/categories/categoryModel");
// import factory 
const {deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../factoryController")

// @desc create a new collection 
// @route POST / collection/create-collection 
// @private 
exports.createCollection = createNewDoc(collectionModel)


// @desc create a new collection 
// @route GET / collections/:id
// @private 
exports.getCollection = getDoc(collectionModel)


// @desc create a new collection 
// @route GET / collections/:id
// @private 
exports.getCollections = getAllDocs(collectionModel)

// @desc create a new collection 
// @route GET / collections/:id
// @private 
exports.updateCollection = updateDoc(collectionModel)

// @desc create a new collection 
// @route GET / collections/:id
// @private 
exports.deleteCollection = deleteDoc(collectionModel)

// @desc create a new collection 
// @route GET / collections/:id
// @private 
exports.getCollectionsOfCategory = asyncHandler(
    async (req,res,next)=>{
        let category_id = req.params.id;
      
        console.log(category_id);
        const collections = await collectionModel.find({category_id: category_id}).populate({path:'category_id' , select: 'category_name'});
        console.log(`collections: ${typeof(collections)} `);

        if(!collections) {
            return next(new ErrorApi(`No Collections belongs to This CategoRy ID Founded in database` , 400));
        }
        else if (collections.length == 0) {
            return res.status(200).json({data: collections , length: collections.length , msg: `No Collection Belongs to This Category`});
        }


        res.status(200).json({data: collections , length: collections.length})
    }
)
