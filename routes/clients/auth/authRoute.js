const express = require("express");
const {signup , login , forgetPassword , verifiedResetCode , resetPassword} = require("../../../controllers/clients/auth/clientAuthController");
const {signupValidator , loginValidator} = require("../../../utils/validator/authValidator");

const router = express.Router();

router.route('/userversion/signup').post(signupValidator, signup)
router.route('/userversion/login').post(loginValidator, login)
router.route('/userversion/forgetPassword').post(forgetPassword)
router.route('/userversion/verifiedResetCode').post(verifiedResetCode)
router.route('/userversion/resetPassword').put(resetPassword)

module.exports = router;