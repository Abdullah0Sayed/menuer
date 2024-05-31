const express = require("express");
const {createBusiness , getBusiness , getAllBusiness , updateBusiness , deleteBusiness , deleteAllBusinessOnUser , uploadBusinessImages , resizeUploadBusinessImages} =  require("../../controllers/business/businessController");
const {createBusinessValidation , getBusinessValidation , updateBusinessValidation , deleteBusinessValidation} = require("../../utils/validator/businessValidator");
const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController");


const router = express.Router();

// create business 
router.route('/business/create-business').post(authenticatedRoute,allowedTo("owner" , "customer"),uploadBusinessImages , resizeUploadBusinessImages ,createBusinessValidation, createBusiness);
router.route('/business/:id').get(authenticatedRoute,allowedTo("owner"),getBusinessValidation, getBusiness).put(updateBusinessValidation, updateBusiness).delete(deleteBusinessValidation , deleteBusiness);
router.route('/business/').get(authenticatedRoute,allowedTo("owner"),getAllBusiness);
router.route('/business/delete-all-business/:user_id').delete(authenticatedRoute,allowedTo("owner"),deleteAllBusinessOnUser);
module.exports = router;