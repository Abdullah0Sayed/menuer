// Import Shifts Model 
const shiftModel = require("../../../models/shifts/shiftModel");
// Import AsyncHandler 
const asyncHandler = require("express-async-handler");
const ErrorApi = require("../../../utils/Errors/errorAPI");



exports.getReportsWithAllShifts = asyncHandler(
    async(req,res,next)=>{
        // 1. get shifts by businessID 
        const business_id = req.business._id;
        // 2. get all shift belongs to this businessId

        // Create filter object
        let filterObject = { business_id , active: false};
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

        // build query 
        let mongooseQuery = shiftModel.find(filterObject);


        //  3- sorting sort('price -item_name')
        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            mongooseQuery = mongooseQuery.sort(sortBy)
        }

         // 5- search 
         if(req.query.keyword) {
            filterObject = {};
            filterObject.$or = [
                {_id: {$regex: req.query.keyword , $options: 'i'}},
                {stuff_id: {$regex: req.query.keyword , $options: 'i'}},

            ]
            mongooseQuery = mongooseQuery.find(filterObject)
        }




        // Execute Query
        const shifts = await mongooseQuery;
        if(!shifts){
            return next(new ErrorApi(`no history of shifts for your Business ${req.business.business_name}`));
        }
        res.status(200).json({data: shifts , length: shifts.length})
    }
)