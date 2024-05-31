// import asyncHandler 
const asyncHandler = require("express-async-handler");

// import qrCode Model 
const qrcodeModel = require("../../models/qrCodes/qrcodeModel");

// import Multer 
const multer = require("multer");


// multer configration 
const upload = multer({dest: '../../uploads/qrcodes'})