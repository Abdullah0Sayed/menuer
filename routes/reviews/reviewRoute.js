const express = require("express");
// import review controller 
const { createReview , deleteReview } = require("../../controllers/reviews/reviewController");
// import auth controller 
const { authenticatedRoute , allowedTo } = require("../../controllers/clients/auth/clientAuthController");
// import router from express 
const router = express.Router();


router.route('/create-review').post(authenticatedRoute , allowedTo('user') , createReview);
router.route('/delete-review/:id').delete(authenticatedRoute , allowedTo('user' , 'owner') , deleteReview);

module.exports = router;