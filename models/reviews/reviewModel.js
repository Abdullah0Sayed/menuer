// import mongoose 
const mongoose = require("mongoose");
// import items 
const itemModel = require("../items/itemModel");
// create modelSchema
const reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
    },
    ratings: {
        type: Number,
        min: [1 , 'min rating is 1.0'],
        max: [5 , 'max rating is 5.0']
    },
    client_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client'
    },
    item_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Items',
        required: true
    },
    business_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Business'
    }
} , {timestamps: true});



// aggregations

reviewSchema.statics.calculateAverageAndQuantity = async function(item_id){
    const aggregationResults = await this.aggregate([
        {$match: {item_id: item_id}}, 
        {$group: {_id: 'item_id' , ratingAverages: {$avg: '$ratings'} , ratingQuantity: {$sum: 1}}}
    ]);
    console.log(aggregationResults);

    if(aggregationResults.length > 0) {
        await itemModel.findByIdAndUpdate(item_id , {
            ratingAverage: aggregationResults[0].ratingAverages,
            ratingQuantity: aggregationResults[0].ratingQuantity
        })
    }
    else {
        await itemModel.findByIdAndUpdate(item_id , {
            ratingAverage: 0,
            ratingQuantity: 0
        })
    }
}

// calling 
reviewSchema.post('save', async function(){
   await this.constructor.calculateAverageAndQuantity(this.item_id)
})


const reviewModel = mongoose.model('Review' , reviewSchema);

module.exports = reviewModel;