const asyncHandler = require("express-async-handler");
const userSignUpModel = require("../../models/users/userSignUpModel");
const ErrorApi = require("../../utils/Errors/errorAPI")
// import factory 
const {deleteDoc , getDoc , createNewDoc , getAllDocs} = require("../factoryController")
const bcrypt = require("bcrypt");



exports.createUser = createNewDoc(userSignUpModel)


// @desc get all user 
// @route GET //users
// @access private/owner
exports.getAllUsers = getAllDocs(userSignUpModel)


// @desc get Specific User Bhy ID
// @route GET menuer/users/:userID
// @access private
exports.getUser = getDoc(userSignUpModel)


// @desc get all user 
// @route PUT /users/
// @access private
exports.updateUser = asyncHandler(
    async (req , res , next) => {
        const email = req.body.email;
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const active = req.body.active;
        const userObject = {
            email,
            first_name,
            last_name,
            active
        }
        const doc = await userSignUpModel.findOneAndUpdate({_id: req.params.id} , userObject , {new: true});
        if(!doc) {
            return res.status(200).json({msg: `No doc Founded in database Matching This ID : ${req.params.id}`})
        }

        res.status(200).json({data: doc})
    }
)


// @desc CHANGE Password of User Based On ID
// @route PUT /menuer/users/:userID/change-password
// @access private/owner

exports.changePassword = asyncHandler(
    async (req , res , next) => {
        const doc = await userSignUpModel.findByIdAndUpdate(req.params.id ,  {password: await bcrypt.hash(req.body.newPassword , 12) , passwordChangedAt: Date.now()} , {new: true});
        
        if(!doc) {
            return next(new ErrorApi(`No Doc Founded For This ID: (${req.params.id}) in Database `));
        }
        res.status(200).json({data: doc})
    }
)

// @desc get all user 
// @route GET /users/
// @access private
exports.deleteUser = deleteDoc(userSignUpModel);


