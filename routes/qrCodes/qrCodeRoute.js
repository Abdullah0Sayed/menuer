// import qrCode Controller
const { generateQrCode , resizeImage , uploadQrCodeImage , readQrCodeContent } = require("../../controllers/qrcodes/qrcodeController");
// import auth controller 
const { authenticatedRoute , allowedTo , allowedPages } = require("../../controllers/auth/authController");
// import express
const express = require("express");
// create a router from express
const router = express.Router();


// generate qr code 
router.route("/menuer/business/generate-qrcode").post(authenticatedRoute , uploadQrCodeImage , resizeImage , generateQrCode)

// get qr code content
router.route("/menuer/business/read-qrcode").post(authenticatedRoute , allowedTo("owner" , "stuff") , allowedPages("5") , readQrCodeContent)





// export 
module.exports = router;