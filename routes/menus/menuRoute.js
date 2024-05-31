// import express 
const express = require("express");

// import menu controller 
const { createMenu , getMenu , getMenus , updateMenu , deleteMenu , getMenuOfBusiness} = require("../../controllers/menus/menuController");

// import menu validator 
const { createMenuValidator , getMenuValidator} = require("../../utils/validator/menuValidator");

const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")




// create a router from express 

const router = express.Router();

// post route for create menu 

router.route('/menus/create-menu').post(authenticatedRoute,allowedTo("owner" , "admin"),createMenuValidator , createMenu)

// get route for get menu byt id 

router.route(`/menus/get-menu/:id`).get(authenticatedRoute,allowedTo("owner" , "admin"),getMenuValidator , getMenu);

// nested route for get menu by business id 

router.route(`/business/:id/menus`).get(authenticatedRoute,allowedTo("owner" , "admin"),getMenuOfBusiness);

// get route for get all menus 

router.route(`/menus/`).get(authenticatedRoute,allowedTo("owner" , "admin"),getMenus)

// put route for update menu

router.route(`/menus/edit-menu/:id`).put(authenticatedRoute,allowedTo("owner" , "admin"),updateMenu)

// delete route for update menu

router.route(`/menus/delete-menu/:id`).delete(authenticatedRoute,allowedTo("owner" , "admin"),deleteMenu)

// exports router 

module.exports = router;