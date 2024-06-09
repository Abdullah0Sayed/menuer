// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import qr Package
const qrCodeGenerator = require("qr-image");
// import fs package for file operations
const fs = require("fs");
// import qrCode Model 
const qrCodeModel = require("../../models/qrCodes/qrcodeModel");
// import business Model 
const businessModel = require("../../models/business/BusinessModel");
// import section Model 
const sectionModel = require("../../models/sections/sectionModel");
// import ownerItems Model 
const ownerItemsModel = require("../../models/ownerItems/ownerItemsModel");
// import uuidv4 to set id for image name
const { v4: uuidv4 } = require("uuid");
// import multer for handling file uploads
const multer = require("multer");
// import sharp package for image processing
const sharp = require("sharp");
const ErrorApi = require("../../utils/Errors/errorAPI");

// configure multer to use memory storage
const multerStorage = multer.memoryStorage();
const multerFilter = function(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb(new ErrorApi(`Category File Not Image`, 400), false);
    }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// upload image in database 
exports.uploadQrCodeImage = upload.single('qr_image');

// processing image 
exports.resizeImage = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const filename = `qr-${uuidv4()}-${Date.now()}.png`;
        await sharp(req.file.buffer).resize(600, 600).toFormat("png").png({ quality: 100 }).toFile(`uploads/qrcodes/${filename}`);
        req.body.qr_image = filename;
    }
    next();
});

// generate QR code and save to database
exports.generateQrCode = asyncHandler(async (req, res, next) => {
    const business_id = req.business.id;
    console.log(business_id);

    // check 
    const qrCode = await qrCodeModel.find({business_id: business_id});
    if(qrCode || qrCode.length >= 1) {
        return next(new ErrorApi(`there is Already one qrCode generated before for your Business` , 400))
    }

    const url = `http://localhost:4000/menuer/business/${business_id}`;
    const qrSvg = qrCodeGenerator.image(url, { type: 'png' });
    const qrBuffer = [];

    qrSvg.on('data', (chunk) => qrBuffer.push(chunk));
    qrSvg.on('end', async () => {
        const buffer = Buffer.concat(qrBuffer);
        console.log(`Buffer`);
        console.log(buffer);
        // Save the QR code as a file (optional, for your reference)
        const filename = `qr-${uuidv4()}-${Date.now()}.png`;
        fs.writeFileSync(`uploads/qrcodes/${filename}`, buffer);

        // Save the QR code to the database
        const qrCodeData = {
            business_id: business_id,
            qr_image: filename,
            qr_content: url
        };

        const qrCodeDoc = await qrCodeModel.create(qrCodeData);

        res.status(201).json({
            status: 'success',
            data: {
                qrCode: qrCodeDoc
            }
        });
    });
});


exports.readQrCodeContent = asyncHandler(
    async(req,res,next)=>{
        // 1. get qrCode Based On ID 
        const business_id = req.business._id;

        // get qrCode 
        const qrCode = await qrCodeModel.findOne({business_id: business_id});

        if(!qrCode) {
            return next(new ErrorApi(`no qrCode Generated For Your Business .. Generate QrCode Now` , 404));
        }


        // get content
        const qrCodeContentExtractedFromQR = qrCode.qr_content;
        const qrCodeBusinessIDExtractedFromQR = qrCode.qr_content.split("/").slice(5).join("");

        console.log(qrCodeContentExtractedFromQR);
        console.log(qrCodeBusinessIDExtractedFromQR);

        // get business data 
        const business = await businessModel.findOne({_id: qrCodeBusinessIDExtractedFromQR}).populate({path: 'user_id' , select: 'email first_name last_name'});
        if(!business) {
            return next(new ErrorApi(`no business founded For You .. Create Business Now` , 404));
        }

        // get business sections
        const sections = await sectionModel.find({business_id: qrCodeBusinessIDExtractedFromQR});

        // get business ownerItems
        const ownerItems = await ownerItemsModel.find({business_id: qrCodeBusinessIDExtractedFromQR});

        res.status(200).json({data: {
            business,
            sections,
            ownerItems
        }})
        // next();
        }
)


