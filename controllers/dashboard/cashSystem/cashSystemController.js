// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import shifts Model 
const shiftModel = require("../../../models/shifts/shiftModel");
// import Client Model 
const clientModel = require("../../../models/clients/clientsModel");
// import Order Model 
const orderModel = require("../../../models/orders/orderModel");
// import Receipt Model 
const receiptModel = require("../../../models/receipt/receiptModel");
// import Owner Item Model 
const ownerItemModel = require("../../../models/ownerItems/ownerItemsModel");
// import Factory Controller 
const factory = require("../../factoryController");
const ErrorApi = require("../../../utils/Errors/errorAPI");


exports.startNewShift = asyncHandler(
    async (req,res,next)=>{
        const newShiftObject = {
            active: true,
            stuff_id: (req.staffInfo)? req.staffInfo._id: req.user._id,
            business_id: req.business._id
        }

        // check if logged user or staff has shift active 
        const activeShift = await shiftModel.findOne(newShiftObject);
        if(activeShift) {
            return next(new ErrorApi(`You Have Already Shift is Active go to ${`http://localhost:4000/menuer/business/cashsystem/shift`} For Managing It`, 200));
        }
        const shift = await shiftModel.create(newShiftObject);
        
        
        res.status(201).json({data: shift})
    }
)

exports.getShift = asyncHandler(
    async(req,res,next)=>{
        const shift_admin_id = (req.staffInfo)? req.staffInfo._id: req.user._id;

        // get current shift orders 
        const shift_id = req.shiftData._id;
        const current_shift_orders = await orderModel.find({shift_id : shift_id}).populate({path: 'client_id' , select: 'first_name last_name mobile'});
        
        if(!current_shift_orders) {
            return next(new ErrorApi(`no shift orders for your shift | ${req.user.first_name} |` , 404));       
        }
        let totalOrdersCash = 0;

        current_shift_orders.map((item)=>{
            return totalOrdersCash = totalOrdersCash + item.total_order;
        })
        // [2] get shift based on shift_admin_id and recently added 
        const shift = await shiftModel.findOne({stuff_id: shift_admin_id , active: true});

        if(!shift) {
            return next(new ErrorApi(`no shift active for you | ${req.user.first_name} |` , 404));       
        }

        shift.cashIn = totalOrdersCash;
        shift.currentCash = shift.cashIn - shift.cashOut;
        await shift.save();
        // [3] response 
        res.status(200).json({shift , current_shift_orders})

    }
)


exports.endShift = asyncHandler(
    async (req,res,next)=>{
        // [1] get stuff_id or owner_id
        const shift_admin_id = (req.staffInfo)? req.staffInfo._id: req.user._id;
        // [2] get shift based on shift_admin_id and recently added 
        const shift = await shiftModel.findOne({stuff_id: shift_admin_id , active: true , business_id: req.business._id});

        if(!shift) {
            return next(new ErrorApi(`no shift active for you | ${req.user.first_name} |` , 404));       
        }

        shift.active = false ;
        shift.endedAt = Date.now();
        await shift.save();
        
        res.status(200).json({status: "success" , shift})

    }
)


exports.getShiftID = asyncHandler(
    async(req,res,next)=>{
        // get shift id from staff id ,
        const shift_admin_id = (req.staffInfo)? req.staffInfo._id: req.user._id;

        // [2] get shift based on shift_admin_id and recently added 
        const shift = await shiftModel.findOne({stuff_id: shift_admin_id , active: true});

        if(!shift) {
            return next(new ErrorApi(`no shift active for you | ${req.user.first_name} |` , 404));       
        }

        req.shiftData = shift;
        next();
        

    }
)

exports.getItemID = asyncHandler(
    async (req,res,next)=>{
        // 1. get Item ID From Request
        const item_id = req.body.item_id;
        console.log(item_id);
        // 2. get item from ownerItem Model
        const itemFromOwnerItems = await ownerItemModel.findById(item_id);
        // 3. response with item data object
        if(!itemFromOwnerItems) {
            return next(new ErrorApi(`no item matching this id ${item_id}` , 404));
        }

        res.status(200).json({data: itemFromOwnerItems , status: 'success'});
    }
)


exports.addNewOrder = asyncHandler(
    async(req,res,next)=>{
        // 1. get Create Order POST Request 
        const mobile = req.body.mobile;
        // mobile
        // check on mobile 
        const client = await clientModel.findOne({mobile , mobile});
        if(!client) {
            return next(new ErrorApi(`no mobile number matching this mobile ${mobile} in database` , 404));
        }

        // loop on items_orders
        const items_order_array = req.body.items_orders;
        let total_order = 0;
        items_order_array.forEach(element => {
            total_order = total_order + (element.price * element.quantity);
            return total_order
        });
        
        // get receipt service setting 
        const receipt = await receiptModel.findOne({business_id: req.business._id});
        if(!receipt){
            const newReceiptSetting = await create({service: 12});
        }
        // totalCost After Apply Receipt Service 12%
        total_order = total_order + (total_order * (receipt.service / 100));
        // discount 
        if(req.body.discount || req.body.discount != 0) {
            let discount = req.body.discount;
            req.body.total_order_after_discount = total_order - (total_order * (discount / 100))
        }
        // add new order with req.body
        const new_order_object = {
            items_orders: req.body.items_orders,
            dining_place: req.body.dining_place,
            payment_method: req.body.payment_method,
            total_order: req.body.total_order | total_order,
            discount: req.body.discount,
            total_order_after_discount: req.body.total_order_after_discount,
            client_id: client._id,
            shift_id: req.shiftData._id,
            business_id: req.business._id
        };

        const newOrder = await orderModel.create(new_order_object);
        // response 
        res.status(201).json({data: newOrder , status: 'success'});
    }
)

exports.addNewClient = asyncHandler(
    
    async(req,res,next)=>{

        const shift_admin_id = (req.staffInfo)? req.staffInfo._id: req.user._id;
        const shift_id = req.shiftData._id;
        const newClientObject = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            mobile: req.body.mobile,
            business_id: req.business._id,
            stuff_id: shift_admin_id,
            shift_id: shift_id
        }

        const new_client = await clientModel.create(newClientObject);

        res.status(201).json({data: new_client , status: 'success'})
    }
)