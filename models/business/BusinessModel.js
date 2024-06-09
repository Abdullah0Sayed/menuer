const mongoose = require("mongoose");


// create a business schema 
const BusinessSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        minlength: 2
    },
    business_slogan: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: 4
    },
    business_logo: String,
    business_cover: String,
    business_address: String,
    business_mobile:[String],
    business_social_media: {
        type: Map,
        of: String
    }
    ,
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    categories_id: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Categories',
    }]

},{timestamps: true});


const returnImageUrlOnResponse = (doc)=>{
    if(doc.business_logo) {
        const img_url = `${process.env.BASE_URL}/business/logos/${doc.business_logo}`;
        doc.business_logo = img_url 
    }
    if(doc.business_cover) {
        const img_url = `${process.env.BASE_URL}/business/covers/${doc.business_cover}`;
        doc.business_cover = img_url 
    }
};


BusinessSchema.post('init' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


BusinessSchema.post('save' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


BusinessSchema.pre(/^find/, function(next) {
    this.populate('categories_id');
    next();
  });

  
const businessModel = mongoose.model('Business' , BusinessSchema);


module.exports = businessModel;