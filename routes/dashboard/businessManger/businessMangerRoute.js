// import express 
const express = require("express");
// import Home Controller 
const { getBusinessGeneralDetails , getBusinessContactDetails , updateGeneralBusinessDetails , updateContactBusinessDetails , uploadBusinessImages , resizeUploadBusinessImages , addNewStaffMember , getStaffMembers , getReceiptSetting ,  setReceiptSetting} = require("../../../controllers/dashboard/businessManger/businessManger");
// import authProtected
const {authenticatedRoute , allowedTo , allowedPages} = require("../../../controllers/auth/authController")
// router
const router = express.Router();

router.route('/menuer/business/dashboard/businessManger/general-details').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),getBusinessGeneralDetails);
router.route('/menuer/business/dashboard/businessManger/contact-details').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),getBusinessContactDetails);
router.route('/menuer/business/dashboard/businessManger/general-details').put(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),uploadBusinessImages , resizeUploadBusinessImages , updateGeneralBusinessDetails);
router.route('/menuer/business/dashboard/businessManger/contact-details').put(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),updateContactBusinessDetails);
router.route('/menuer/business/dashboard/businessManger/staff-member/add-staff').post(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),addNewStaffMember);
router.route('/menuer/business/dashboard/businessManger/staff-member/active-members').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),getStaffMembers);
router.route('/menuer/business/dashboard/businessManger/receipt-setting/set-financial').get(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),getReceiptSetting);
router.route('/menuer/business/dashboard/businessManger/receipt-setting/set-financial').post(authenticatedRoute,allowedTo("stuff","owner"),allowedPages(5),setReceiptSetting);
module.exports = router;