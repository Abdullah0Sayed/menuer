// import express 
const express = require("express");
// import Section Controller 
const { createSection , updateSection , getAllSections , getSection, deleteSection , getSectionsOfBusiness} = require("../../controllers/sections/sectionController");
// import section validator 
const { createSectionValidator , updatedSectionValidator , getSectionValidator, deleteSectionValidator} = require("../../utils/validator/sectionValidator");


const {authenticatedRoute , allowedTo} = require("../../controllers/auth/authController")
// router from express 

const router = express.Router();

// post route For Create Section

router.route('/menus/business/sections/create-section').post(authenticatedRoute,allowedTo("owner"),createSectionValidator,createSection);
router.route('/menus/business/sections/create-section').get(authenticatedRoute,allowedTo("owner"),getSectionsOfBusiness);

// put route for update section 

router.route('/menus/sections/update-section/:id').put(authenticatedRoute,allowedTo("owner"),updatedSectionValidator , updateSection);

// get route for get all sections 

router.route('/menus/sections/').get(authenticatedRoute,allowedTo("owner"),getAllSections)

// get route for get section 

router.route('/menus/sections/get-section/:id').get(authenticatedRoute,allowedTo("owner"),getSectionValidator , getSection);

// delete route for delete section 

router.route('/menus/sections/delete-section/:id').delete(authenticatedRoute,allowedTo("owner"),deleteSectionValidator , deleteSection);

// EXPORT Router 

module.exports = router;