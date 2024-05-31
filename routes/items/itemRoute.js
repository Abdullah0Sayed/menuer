// import express 
const express = require("express");
// import item controller 
const { createItem , getItems , getItem , updateItem , deleteItem , uploadItemImage , resizeItemImage} = require("../../controllers/items/itemController");
// import item validator 
const { createItemValidator , getItemValidator , updateItemValidator , deleteItemValidator} = require("../../utils/validator/itemValidator");
const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")
const router = express.Router();

router.route("/items/create-item").post(authenticatedRoute,allowedTo("admin"),uploadItemImage , resizeItemImage , createItemValidator , createItem)
// get all items 
router.route("/items").get(authenticatedRoute,allowedTo("admin" , "owner"),getItems);
router.route("/items/:id").get(authenticatedRoute,allowedTo("admin" , "owner"),getItemValidator , getItem).put(authenticatedRoute,allowedTo("admin" , "owner"),uploadItemImage , resizeItemImage ,updateItemValidator , updateItem).delete(authenticatedRoute,allowedTo("admin"),deleteItemValidator , deleteItem);

// export router 
module.exports = router;