const asyncHandler = require("express-async-handler");
// import business model 
const businessModel = require("../../../models/business/BusinessModel");
// import sectionModel 
const sectionsModel = require("../../../models/sections/sectionModel");
// import ownerItemsModel
const ownerItemsModel = require("../../../models/ownerItems/ownerItemsModel");

// import Error Api 
const ErrorApi = require("../../../utils/Errors/errorAPI");

exports.getBusinessData = asyncHandler(
    async (req,res,next)=> {
        // get user id from protected route
        const id = req.user._id
        console.log(id);
        const business = await businessModel.find({user_id: id});
        // fetch business id after get business model 
        const business_id = business[0]._id;
        // console.log(`Business ID : ${business_id}`);
        // get sections related with business 
        const sections = await sectionsModel.find({business_id}).select('section_name').sort('section_name')
        // get items for each sections 
         // get section id 
         
         // get items 
 

         const items = await ownerItemsModel.find({
            section_id: { $exists: true, $in: sections }
          });
          
        if(!business) {
            return next(new ErrorApi(`No Business Created To This User - Create Business Now`));
        }

        if(!sections || sections.length == 0) {
            console.log(`No Sections Created`);
        }
        
        res.status(200).json({business , sections , items})
    }
)

exports.getItemsOfSection = asyncHandler(
    async (req, res, next) => {
        // Get section ID
        const section_id = req.params.sectionId;
        console.log(section_id);

        // Create filter object
        let filterObject = { section_id: section_id };
        let queryStringObject = { ...req.query };

        // Exclude fields from query
        const excludeFromQuery = ['sort', 'limit', 'fields', 'keyword'];
        excludeFromQuery.forEach(ele => {
            delete queryStringObject[ele];
        });

        // Convert query object to MongoDB operators
        queryStringObject = JSON.stringify(queryStringObject).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObject = JSON.parse(queryStringObject);

        // Merge filterObject with queryObject
        filterObject = { ...filterObject, ...queryObject };


        let mongooseQuery = ownerItemsModel.find(filterObject);
         //  3- sorting sort('price -item_name')
         if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            mongooseQuery = mongooseQuery.sort(sortBy)
        }

         // 5- search 
         if(req.query.keyword) {
            filterObject = {};
            filterObject.$or = [
                {item_display_name: {$regex: req.query.keyword , $options: 'i'}},
                {description: {$regex: req.query.keyword , $options: 'i'}},
            ]
            mongooseQuery = mongooseQuery.find(filterObject)
        }


        // Get items
        const items = await mongooseQuery;

        if (!items || items.length === 0) {
            return next(new ErrorApi(`No items found for this section ${section_id}`, 204));
        }
        res.status(200).json({ items });
    }
);
