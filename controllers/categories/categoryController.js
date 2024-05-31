const asyncHandler = require("express-async-handler");
const CategoryModel = require("../../models/categories/categoryModel");
const ErrorApi = require("../../utils/Errors/errorAPI")
const slugify  = require("slugify");
// import factory 
const {deleteDoc , getDoc , updateDoc , getAllDocs , createNewDoc} = require("../factoryController")

// import uuidv4 to set id for image name
const { v4:uuidv4 }= require("uuid")
// import multer for deal with form-data for file uploads 
const multer = require("multer");
// import sharp package for image processing
// Note :: - Sharp Accept input / image as a buffer you need use from multer memory storage not disk storage 
const sharp = require("sharp");
// configuration of DiskStorage inSide Multer 
/*
const multerStorage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null , 'uploads/categories')
    }, 
    filename: function(req,file,cb){
        const ext = file.mimetype.split("/")[1];
        const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
        cb(null , filename)
    }
})
*/
const multerStorage = multer.memoryStorage();
// filter file to accept images only 
const multerFilter = function(req,file,cb){
    if(file.mimetype.startsWith("image")) {
        cb(null , true)
    }
    else {
        cb(new ErrorApi(`Category File Not Image` , 400) , false)
    }
}
// set setting of DiskStorage For Multer 
const upload = multer({storage: multerStorage , fileFilter: multerFilter});


// upload image in database 
exports.uploadCategoryImage = upload.single('category_image');
// processing image 
exports.resizeImage = asyncHandler(
    async (req,res,next)=>{
        // console.log(req.file);
        if(req.file) {
            const filename = `category-${uuidv4()}-${Date.now()}.png`;
            await sharp(req.file.buffer).resize(500,500).toFormat("png").png({quality:95}).toFile(`uploads/categories/${filename}`);
            req.body.category_image = filename;
        }
      
        next();
    }
    
)
exports.addNewCategory = createNewDoc(CategoryModel)

exports.getCategories = getAllDocs(CategoryModel)


exports.getCategory = getDoc(CategoryModel)

exports.updateCategory = updateDoc(CategoryModel)


exports.deleteCategory = deleteDoc(CategoryModel)