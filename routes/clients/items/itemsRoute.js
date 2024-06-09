// import express 
const express = require("express");
// import itemsController
const { itemsPage , getSpecificItemBasedOnOwnerItemID} = require("../../../controllers/clients/items/itemController");
// import Auth Clients Controller
const { authenticatedRoute , allowedTo } = require("../../../controllers/clients/auth/clientAuthController");

// create a router from express 

const router = express.Router();

// getAllItems Route
router.route('/menuer/user-version/items').get(authenticatedRoute ,allowedTo('user') ,  itemsPage)
// getSpecificItem Route
router.route('/menuer/user-version/items/:id').get(authenticatedRoute ,allowedTo('user') ,  getSpecificItemBasedOnOwnerItemID)



// export a router 
module.exports = router;