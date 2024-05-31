const express = require("express");
const {signup , login , forgetPassword , verifiedResetCode , resetPassword} = require("../../controllers/auth/authController");
const {signupValidator , loginValidator} = require("../../utils/validator/authValidator");

const router = express.Router();

router.route('/signup').post(signupValidator, signup)
router.route('/login').post(loginValidator, login)
router.route('/forgetPassword').post(forgetPassword)
router.route('/verifiedResetCode').post(verifiedResetCode)
router.route('/resetPassword').put(resetPassword)

module.exports = router;