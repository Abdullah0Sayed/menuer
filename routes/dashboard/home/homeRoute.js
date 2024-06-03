// import express 
const express = require("express");
// import Home Controller 
const { getBusinessData , getItemsOfSection} = require("../../../controllers/dashboard/home/homeController");
// const { getMenuItem} = require("../../controllers/dashboard/menuManger");
// import authProtected
const {authenticatedRoute , allowedTo} = require("../../../controllers/auth/authController")
const router = express.Router();

// get business of user 


router.route('/menuer/business/dashboard/home/').get(authenticatedRoute,allowedTo("stuff","owner"),getBusinessData);
router.route('/menuer/business/dashboard/home/:sectionId').get(authenticatedRoute,allowedTo("stuff","owner"),getItemsOfSection);
// router.route('/dashboard/menu-item/:id').get(authenticatedRoute,allowedTo("stuff","owner"),getMenuItem);



module.exports = router;