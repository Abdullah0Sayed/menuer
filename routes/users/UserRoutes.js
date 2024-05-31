const express = require("express");
const {createUser , getAllUsers , getUser , updateUser, deleteUser , changePassword} = require("../../controllers/users/userController");
const {addNewUserValidation ,getUserValidation , changePasswordValidation , updateUserValidation} = require("../../utils/validator/userValidator");
const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")
const router = express.Router({mergeParams: true});


router.route('/users/create-user').post(authenticatedRoute,allowedTo("user" , "owner") , addNewUserValidation , createUser)
router.route('/users').get(authenticatedRoute,allowedTo("owner" , "admin") ,getAllUsers);
router.route('/users/:id/change-password').put(authenticatedRoute,allowedTo("owner" , "admin") ,changePasswordValidation, changePassword);
router.route('/users/:id').get(authenticatedRoute,allowedTo("owner" , "admin") ,getUserValidation,getUser).put(authenticatedRoute,allowedTo("owner" , "admin") ,updateUserValidation , updateUser).delete(authenticatedRoute,allowedTo("owner" , "admin") ,deleteUser)

module.exports = router;