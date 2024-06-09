// import express 
const express = require("express");
// import home controller of client 
const { getOwnerItemsAndBusiness} = require("../../../controllers/clients/home/homeController");
// import Auth Controller Of Client 
const { authenticatedRoute , allowedTo } = require("../../../controllers/clients/auth/clientAuthController")


// create a router from express 
const router = express.Router();


// Get All Owner Items 
router.route('/menuer/user-version/home').get(authenticatedRoute , allowedTo('user') , getOwnerItemsAndBusiness);
// router.route('/menuer/user-version/home').get(authenticatedRoute , allowedTo('user') , getAllBusiness);




// export router to server 
module.exports = router;