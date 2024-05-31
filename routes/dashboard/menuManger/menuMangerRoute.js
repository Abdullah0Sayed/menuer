// import express 
const express = require("express");
// import Home Controller 
const { getMenuSections , getMenuCollectionsBasedOnCategoryId , addMenuSectionAndItems , getMenuItem , getItemOfSections} = require("../../../controllers/dashboard/menuManger/menuManger");
// import authProtected
const {authenticatedRoute , allowedTo , allowedPages} = require("../../../controllers/auth/authController")
const router = express.Router();

// get business of user 


router.route('/dashboard/menuManger/').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(1),getMenuSections);
router.route('/dashboard/menuManger/add-item').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(1),getMenuCollectionsBasedOnCategoryId);
router.route('/dashboard/menuManger/add-item').post(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(1),addMenuSectionAndItems);
router.route('/dashboard/menu-item/:id').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(1),getMenuItem);
router.route('/dashboard/menuManger/sections/:id/items').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(1),getItemOfSections);


// router.route('/dashboard/home/:id').get(authenticatedRoute,allowedTo("stuff","owner"),getItemsOfSection);




module.exports = router;