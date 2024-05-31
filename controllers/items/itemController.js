// import async handler 
const asyncHandler = require("express-async-handler");
// import factory 
const { deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../../controllers/factoryController");
// import sharp for apply some of processing on image
const sharp = require("sharp");
// import uuidv4 from uuid 
const {v4: uuidv4} = require("uuid")
// import multer 
const multer = require("multer");
// import item Model 
const itemModel = require("../../models/items/itemModel");
// import Error API
const ErrorApi = require("../../utils/Errors/errorAPI");
// import apiFeatures 
const Features = require("../../utils/features/apiFeatures");

// use memoryStorage from multer to access buffer and pass it to sharp later 
const multerStorage = multer.memoryStorage();
// filter file image to accept image only 
const multerFilter = function(req,file,cb){
    if(file.mimetype.startsWith("image")) {
        cb(null , true)
    }
    else {
        cb(new ErrorApi(`Item File Not Image , Please Upload Image` , 400) , false)
    }

}

// configuration of multer 
const upload = multer({storage: multerStorage , fileFilter: multerFilter});


// upload single image -> single add new property to request called file 
exports.uploadItemImage = upload.single('item_image');

// set some of image processing on image item 
exports.resizeItemImage = asyncHandler(
    async (req,res,next)=>{
        const filename = `item-${uuidv4()}-${Date.now()}.png`;

        if(req.file) {
            await sharp(req.file.buffer).resize(500,500).toFormat("png").png({quality: 95}).toFile(`uploads/items/${filename}`);
        
            req.body.item_image = filename;
        }
       
        console.log(req.body);
        next();
    }
)


exports.createItem = createNewDoc(itemModel)

exports.getItems = getAllDocs(itemModel)

exports.getItem = getDoc(itemModel)

exports.updateItem = updateDoc(itemModel)

exports.deleteItem = deleteDoc(itemModel)