// import collection Controller 
const { createCollection , getCollection , getCollections  , updateCollection , deleteCollection , getCollectionsOfCategory} = require("../../controllers/collections/collectionController");
// import collection validators 
const { createCollectionValidator , getCollectionValidator , getCollectionsOfCategoryValidator , updatedCollectionValidator , deleteCollectionValidator} = require("../../utils/validator/collectionValidator");
// import express to use router 
const express = require("express");
// declaration a router 
const router = express.Router();

const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")
// create a route
router.route('/collections/create-collection').post(authenticatedRoute,allowedTo("stuff","owner"),createCollectionValidator , createCollection);
// get collection 
router.route('/collections/:id').get(authenticatedRoute,allowedTo("stuff","owner"),getCollectionValidator , getCollection).put(authenticatedRoute,allowedTo("stuff","owner"),updatedCollectionValidator , updateCollection).delete(authenticatedRoute,allowedTo("owner"),deleteCollectionValidator , deleteCollection)
// get all collections 
router.route("/collections").get(authenticatedRoute,allowedTo("stuff","owner"),getCollections)
// get all collection of category by category ID
router.route("/category/:id/collections").get(authenticatedRoute,allowedTo("stuff","owner"),getCollectionsOfCategoryValidator , getCollectionsOfCategory)
// export router of categories 
module.exports = router;