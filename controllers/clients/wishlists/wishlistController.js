// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import errorApi 
const ErrorApi = require("../../../utils/Errors/errorAPI");
// import client Model 
const clientModel = require("../../../models/clients/clientsModel");


exports.addItemToFavoriteList = asyncHandler(
    async(req,res,next)=>{
        // get userLogged
        const client = await clientModel.findByIdAndUpdate(req.user._id , {
            $addToSet: {wishlists: req.body.ownerItemId}
        }, {
            new: true
        });
        console.log(client);
        res.status(200).json({data: client , status: 'Item is Added To Your Favorite Successfully'});
    }
)


exports.getMyFavorite = asyncHandler(
    async (req, res, next)=>{
        // get Logged User 
        const myFavorite = await clientModel.findById(req.user._id).populate({path: 'wishlists'})
        res.status(200).json({favoriteList: myFavorite.wishlists ,status: 'your wishlist is returned successfully'})
    }
)


exports.removeItemFromFavoriteList = asyncHandler(
    async(req,res,next)=>{
        // get userID; 
        const client = await clientModel.findByIdAndUpdate(req.user._id , {
            $pull: {wishlists: req.params.id}
        }, {
            new: true
        });

        // check 
        if(!client) {
            return next(new ErrorApi(`no client founded in database` , 404));
        }

        res.status(200).json({data: client, status: 'item removed from your wishlist'})
    }
)