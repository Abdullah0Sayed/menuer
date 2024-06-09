const express = require("express");
const {addNewCategory , getCategories , getCategory , updateCategory , deleteCategory , uploadCategoryImage , resizeImage} = require("../../controllers/categories/categoryController");
const {addCategoryValidation , getCategoryValidation , updatedCategoryValidation , deleteCategoryValidation} = require("../../utils/validator/categoryValidator");
const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")
const router = express.Router();
const {getAllUsers} = require("../../controllers/users/userController");



router.use('/categories/:categoryID/user' , getAllUsers)
router.route("/").post(uploadCategoryImage,resizeImage,addCategoryValidation , addNewCategory);

router.route("/menus/business/categories").get(authenticatedRoute,getCategories);
router.route("/categories/:id").get(authenticatedRoute,allowedTo("admin","owner"),getCategoryValidation , getCategory).put(authenticatedRoute,allowedTo("admin","owner"),uploadCategoryImage,resizeImage,updatedCategoryValidation, updateCategory).delete(authenticatedRoute,allowedTo("admin","owner"),deleteCategoryValidation , deleteCategory)
module.exports = router;