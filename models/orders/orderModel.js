// import order Model 

const mongoose = require("mongoose");

// create a schema for order 

/*

    items_ids {
        item_id: count
    }
*/

const orderSchema = new mongoose.Schema({
    items_orders: [
        {
            item_id: {
                type: mongoose.Schema.ObjectId,
                ref: 'Items'
            },
            item_variant: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 1
            }, 
            price: {
                type: Number,
            }
        },

    ],
    dining_place: {
        type: String,
        enum: ['Dine In' , 'Take Away'],
        default: 'Take Away'
    },
    payment_method: {
        type: String,
        enum: ['Visa' , 'Cash'],
        default: 'Visa'
    },
    total_order: {
        type: Number,
        default: 0
    },
    customer_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    shift_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shift'
    }

    
} , {timestamps: true});


// create a model for orders

const orderModel = mongoose.model('Order' , orderSchema);


// exports model 

module.exports = orderModel;