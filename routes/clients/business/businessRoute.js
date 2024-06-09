// import express 
const express = require("express");
// import home controller of client 
const { getAllInBusiness , getBusiness , getItemsOfSectionsBySectionID , getRestaurantsBusiness , getCoffeeShopBusiness , getJuiceShopBusiness , getPatisserieBusiness, getIceCreamShopBusiness} = require("../../../controllers/clients/business/businessController");
// import Auth Controller Of Client 
const { authenticatedRoute , allowedTo } = require("../../../controllers/clients/auth/clientAuthController")


// create a router from express 
const router = express.Router();


// Get All Owner Items 
router.route('/menuer/user-version/business').get(authenticatedRoute , allowedTo('user') , getAllInBusiness);
// Get All Owner Items 
router.route('/menuer/user-version/business/:id').get(authenticatedRoute , allowedTo('user') , getBusiness);
// Get All Owner Items 
router.route('/menuer/user-version/sections/:id/items').get(authenticatedRoute , allowedTo('user') , getItemsOfSectionsBySectionID);
// Get All Business Restaurant  
router.route('/menuer/user-version/business-restaurant/').get(authenticatedRoute , allowedTo('user') , getRestaurantsBusiness);
// Get All Business CoffeShop  
router.route('/menuer/user-version/business-coffee-shop/').get(authenticatedRoute , allowedTo('user') , getCoffeeShopBusiness);
// Get All Business JuiceShop  
router.route('/menuer/user-version/business-juice-shop/').get(authenticatedRoute , allowedTo('user') , getJuiceShopBusiness);
// Get All Business JuiceShop  
router.route('/menuer/user-version/business-juice-shop/').get(authenticatedRoute , allowedTo('user') , getJuiceShopBusiness);
// Get All Business getPatisserieBusiness  
router.route('/menuer/user-version/business-patisserie/').get(authenticatedRoute , allowedTo('user') , getPatisserieBusiness);
// Get All Business getIceCreamShopBusiness  
router.route('/menuer/user-version/business-ice-cream/').get(authenticatedRoute , allowedTo('user') , getIceCreamShopBusiness);



// export router to server 
module.exports = router;