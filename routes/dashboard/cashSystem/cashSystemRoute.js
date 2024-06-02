// import express 
const express = require("express");
// import shiftController 
const { startNewShift , endShift , getShift , getShiftID , getItemID , addNewOrder , addNewClient} = require("../../../controllers/dashboard/cashSystem/cashSystemController");
// import auth controller 
const { authenticatedRoute , allowedTo , allowedPages } = require("../../../controllers/auth/authController");



// create Router From EXPRESS
const router = express.Router();


// start new shift

router.route('/menuer/business/cashsystem/startShift').post(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , startNewShift);

// end current shift

router.route('/menuer/business/cashsystem/endShift').put(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , endShift);

// get shift data 

router.route('/menuer/business/cashsystem/shift').get(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , getShiftID , getShift);

// get items order

router.route('/menuer/business/cashsystem/new-order').get(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , getShiftID , getItemID);
// create new order

router.route('/menuer/business/cashsystem/new-order').post(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , getShiftID , addNewOrder);
// create new order

router.route('/menuer/business/cashsystem/add-client').post(authenticatedRoute , allowedTo("stuff" , "owner") , allowedPages("2") , getShiftID , addNewClient);


// exports router 
module.exports = router;