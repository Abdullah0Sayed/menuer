// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import items model 
const ownerItemsModel = require("../../../models/ownerItems/ownerItemsModel");
// import orders model 
const ordersModel = require("../../../models/orders/orderModel");
// import Client model 
const clientModel = require("../../../models/clients/clientsModel");
// import Client model 
const reviewModel = require("../../../models/reviews/reviewModel");


exports.itemsPage = asyncHandler(
    async(req,res,next)=>{
        // 1. get all owners Items 
        const ownerItems = await ownerItemsModel.find().populate({path: 'item_id', select: 'item_image'}).limit(6);
        // 2. get all owners Items Based on Orders
        const ownerItemsFromOrders = await ordersModel.find();
        // initialize an empty array to hold all items ids from orders history
        let items_ids_array = [];

        ownerItemsFromOrders.forEach(order => {
            console.log(order.items_orders);
            // loop on orderArray
            order.items_orders.forEach(orderObject => {
                items_ids_array.push(orderObject.item_id);
                
            });
        });
        console.log(`Before Apply Filter`);
        console.log(items_ids_array);

        items_ids_array = items_ids_array.filter((_, index) => index % 2 === 0).slice(0, 6);


        console.log(`After Apply Filter`);
        console.log(items_ids_array);


        if(!ownerItems) {
            return next(new ErrorApi(`no ownerItems Founded in database` , 404));
        }
        // Menuer Choices 
        const menuer_choices = await ownerItemsModel.find({_id: {$exists: true , $in: items_ids_array}})


        // get Items based 
        const loggedClient = await clientModel.findOne({_id: req.user._id});
        const clientWishListArray = loggedClient.wishlists;

        const getItemsWishList = await ownerItemsModel.find({_id: {$exists: true , $in: clientWishListArray}});
        console.log(getItemsWishList);

        // discover different items 
        const different_items = ownerItems;

        res.status(200).json({menuer_choices , different_items , getItemsWishList})
    }
)


exports.getSpecificItemBasedOnOwnerItemID = asyncHandler(
    async(req,res,next)=>{
        // 1. get ownerItemID in Params 
        const ownerItemId = req.params.id;
        // 2. get ownerItem From Database
        const ownerItem = await ownerItemsModel.findById(ownerItemId).populate({path: 'item_id' , select: 'item_image ratingAverage ratingQuantity'}).populate({path: 'business_id' , select: 'business_name business_logo'});

        // check
        if(!ownerItemId) {
            return next(new ErrorApi(`no item founded in database matching these id ${ownerItemId}` , 404));
        }
        const ownerItemsFromOrders = await ordersModel.find();
        // initialize an empty array to hold all items ids from orders history
        let items_ids_array = [];

        ownerItemsFromOrders.forEach(order => {
            console.log(order.items_orders);
            // loop on orderArray
            order.items_orders.forEach(orderObject => {
                items_ids_array.push(orderObject.item_id);
                
            });
        });
        console.log(`Before Apply Filter`);
        console.log(items_ids_array);

        items_ids_array = items_ids_array.filter((_, index) => index % 2 !== 0).slice(0, 5);


        console.log(`After Apply Filter`);
        console.log(items_ids_array);
        const mayAlsoLike = items_ids_array;
        // get items based on ids in maAlsoLikeArray
        const itemsMayLikeIt = await ownerItemsModel.find({_id: {$exists: true , $in: mayAlsoLike}})

        const item_id = ownerItem.item_id._id;
        // get reviews of item
        const reviews = await reviewModel.find({item_id: item_id}).populate({path: 'item_id' , select: 'item_image ratingAverage ratingQuantity'}).populate({path: 'business_id' , select: 'business_name business_logo'});


        res.status(200).json({item: ownerItem , reviews:reviews , mayAlsoLike:itemsMayLikeIt })
    }
)