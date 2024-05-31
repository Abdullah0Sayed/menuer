const express = require("express");
// import review controller 
const { createReview } = require("../../controllers/reviews/reviewController");
// import auth controller 
const { authenticatedRoute , allowedTo } = require("../../controllers/auth/authController");
// import router from express 
const router = express.Router();


router.route('/create-review').post(authenticatedRoute , allowedTo('user') , createReview);

module.exports = router;