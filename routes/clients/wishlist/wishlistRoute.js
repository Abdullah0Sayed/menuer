// import wishlist Controller 
const { addItemToFavoriteList , getMyFavorite , removeItemFromFavoriteList} = require("../../../controllers/clients/wishlists/wishlistController");
// import collection validators 
const { authenticatedRoute , allowedTo } = require("../../../controllers/clients/auth/clientAuthController");
// import express to use router 
const express = require("express");
// declaration a router 
const router = express.Router();

// add item to wishList
router.route('/menuer/user-version/favorites/add-to-favorite').put(authenticatedRoute , allowedTo('user') ,addItemToFavoriteList);
// get user wishList
router.route('/menuer/user-version/favorites/my-favorite-list').get(authenticatedRoute , allowedTo('user') ,getMyFavorite);
// delete item from  wishList
router.route('/menuer/user-version/favorites/delete-item/:id').put(authenticatedRoute , allowedTo('user') ,removeItemFromFavoriteList);




// export router

module.exports = router;