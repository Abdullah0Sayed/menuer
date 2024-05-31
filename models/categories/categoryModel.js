const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        unique: [true , "Category Must Be Required"],
        trim: true,
        lowercase : true, 
    }, 
    slug: {
        type: String,
        lowercase: true
    },
    category_image: {
        type: String,
        require: true
    }
}, {timestamps: true})

const returnImageUrlOnResponse = (doc)=>{
    if(doc.category_image) {
        const img_url = `${process.env.BASE_URL}/categories/${doc.category_image}`;
        doc.category_image = img_url 
    }
   
};


categorySchema.post('init' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


categorySchema.post('save' , (doc)=> {
    returnImageUrlOnResponse(doc);
})


const CategoryModel = mongoose.model("Categories" , categorySchema);

module.exports = CategoryModel;