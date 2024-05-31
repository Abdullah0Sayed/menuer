// import async handler 
const asyncHandler = require("express-async-handler");
// import ErrorApi 
const ErrorApi = require("../utils/Errors/errorAPI");
// import api Features 
const Features = require("../utils/features/apiFeatures");

exports.deleteDoc = (Model) => asyncHandler(
        async (req,res,next)=>{
            const doc = await Model.findOneAndDelete({_id: req.params.id});
    
            if(!doc) {
                return next(new ErrorApi(`No doc Founded In Database For This ID ${req.params.id}`));
            }
            res.status(200).json({msg: `doc Deleted Successfully`})
        }
    )


exports.getDoc = (Model) => asyncHandler(
        async(req,res,next)=>{

            const doc = await Model.findById(req.params.id);
            if(!doc) {
                return next(new ErrorApi(`No doc Founded In Database For This ID:${req.params.id}` , 200))
            }
            res.status(200).json({data: doc});
    
        }
    )

exports.updateDoc = (Model) => asyncHandler(
    async (req , res , next) => {
        
        const doc = await Model.findOneAndUpdate({_id: req.params.id} , req.body , {new: true});
        if(!doc) {
            return res.status(200).json({msg: `No doc Founded in database Matching This ID : ${req.params.id}`})
        }

        res.status(200).json({data: doc})
    }
)

exports.getAllDocs = (Model) => asyncHandler(
    async(req, res, next) => {


          // build query
        const apiFeature = new Features(Model.find() , req.query).filter().sort().search().limitFields().pagination();

        // execute query
        const docs = await apiFeature.mongooseQuery;

        if (!docs) {
            return next(new ErrorApi(`No docs Founded In Database`, 204));
        }

        res.status(200).json({results: docs.length , data: docs});
    }
);

exports.createNewDoc = (Model) => asyncHandler(
    async (req, res) => {
        
        const newDoc = await Model.create(req.body);

        res.status(200).json({data: newDoc});
    }
)