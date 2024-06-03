// import express
const express = require("express");
// import report controller 
const { getReportsWithAllShifts } = require("../../../controllers/dashboard/reports/reportsController");
// import auth controller 
const { authenticatedRoute , allowedPages , allowedTo } = require("../../../controllers/auth/authController");

// create router app from express 
const router = express.Router();


router.route('/menuer/business/dashboard/reports').get(authenticatedRoute , allowedTo('stuff' , 'owner'), allowedPages('3') ,getReportsWithAllShifts)



// export router to server 
module.exports = router;