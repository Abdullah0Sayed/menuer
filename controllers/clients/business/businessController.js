// import asyncHandler 
const asyncHandler = require("express-async-handler");
// import business Model 
const businessModel = require("../../../models/business/BusinessModel");
// import Section Model 
const sectionModel = require("../../../models/sections/sectionModel");
// import Owner Model 
const ownerItemsModel = require("../../../models/ownerItems/ownerItemsModel");
// import factory controller 
const factory = require("../../factoryController");
// import ErrorApi
const ErrorApi = require("../../../utils/Errors/errorAPI");



exports.getAllInBusiness = asyncHandler(
    async(req,res,next)=>{
        // get trending business based on reviews
        
        const business = await businessModel.find().select('business_name business_logo category_name');
        let resArray = [];
        let coffeeShopArray = [];
        let juiceShopArray = [];
        let patisserieArray = [];
        let iceCreamArray = [];

        let restaurantBusiness;
        let coffeeShopBusiness;
        let iceCreamShopBusiness;
        let juiceShopBusiness;
        let patisserieBusiness;
        if(!business) {
            return next(new ErrorApi(`no business Founded in database` , 404));
        }
        // restaurant business 
        business.findIndex(element => {
            let result
                 result = element.categories_id.forEach(category=>{
                 if(category.category_name == 'restaurant') {
                    resArray.push(element)
                 }
               
            })
            
        });
        restaurantBusiness = resArray;

        // coffee-shop business 
        business.findIndex(element => {
            let result
                 result = element.categories_id.forEach(category=>{
                 if(category.category_name == 'coffee shop') {
                    coffeeShopArray.push(element)
                 }
               
            })
            
        });
        coffeeShopBusiness = coffeeShopArray;
        // juice-shop business 
        business.findIndex(element => {
            let result
                 result = element.categories_id.forEach(category=>{
                 if(category.category_name == 'juice shop') {
                    juiceShopArray.push(element)
                 }
               
            })

        });
        juiceShopBusiness = juiceShopArray;
        // patisserie-shop business 
        business.findIndex(element => {
            let result
                 result = element.categories_id.forEach(category=>{
                 if(category.category_name == 'patisserie') {
                    patisserieArray.push(element)
                 }
               
            })

        });
        patisserieBusiness = patisserieArray;
        // iceCream-shop business 
        business.findIndex(element => {
            let result
                 result = element.categories_id.forEach(category=>{
                 if(category.category_name == 'juice shop') {
                    iceCreamArray.push(element)
                 }
               
            })

        });
        iceCreamShopBusiness = iceCreamArray;

        res.status(200).json({restaurantBusiness, coffeeShopBusiness , juiceShopBusiness , patisserieBusiness , iceCreamShopBusiness , status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)


exports.getBusiness = asyncHandler(
    async(req,res,next)=>{

        const business = await businessModel.findById(req.params.id);
        if(!business) {
            return next(new ErrorApi(`No doc Founded In Database For This ID:${req.params.id}` , 200))
        }
        // get sections 
        const sections = await sectionModel.find({business_id: req.params.id});

        res.status(200).json({business , sections , status: 'success'});

    }
)


exports.getItemsOfSectionsBySectionID = asyncHandler(
    async(req,res,next)=>{
        // get sections 
        const items = await ownerItemsModel.find({section_id: req.params.id}).populate({path: 'item_id' , select: 'item_image'});
        res.status(200).json({items})
    }
)


exports.getRestaurantsBusiness = asyncHandler(
    async (req,res,next)=>{

        // get trending business based on reviews
        const business = await businessModel.find();
        console.log(business);
        let resArray = [];
        let restaurantBusiness;

        if(!business) {
                    return next(new ErrorApi(`no business Founded in database` , 404));
                }

        // restaurant business 
                business.findIndex(element => {
                    let result
                        result = element.categories_id.forEach(category=>{
                        if(category.category_name == 'restaurant') {
                            resArray.push(element)
                        }
                    })
                    
                });
                
                restaurantBusiness = resArray;
        res.status(200).json({restaurantBusiness, status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)


exports.getCoffeeShopBusiness = asyncHandler(
    async (req,res,next)=>{

        // get trending business based on reviews
        const business = await businessModel.find();
        console.log(business);
        let coffeeShopArray = [];
        let coffeeShopBusiness;

        if(!business) {
                    return next(new ErrorApi(`no business Founded in database` , 404));
                }

        // restaurant business 
                business.findIndex(element => {
                    let result
                        result = element.categories_id.forEach(category=>{
                        if(category.category_name == 'coffee shop') {
                            coffeeShopArray.push(element)
                        }
                    })
                    
                });
                
                coffeeShopBusiness = coffeeShopArray;
        res.status(200).json({coffeeShopBusiness, status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)


exports.getJuiceShopBusiness = asyncHandler(
    async (req,res,next)=>{

        // get trending business based on reviews
        const business = await businessModel.find();
        console.log(business);
        let juiceShopArray = [];
        let juiceShopBusiness;

        if(!business) {
                    return next(new ErrorApi(`no business Founded in database` , 404));
                }

        // restaurant business 
                business.findIndex(element => {
                    let result
                        result = element.categories_id.forEach(category=>{
                        if(category.category_name == 'juice shop') {
                            juiceShopArray.push(element)
                        }
                    })
                    
                });
                
                juiceShopBusiness = juiceShopArray;
        res.status(200).json({juiceShopBusiness, status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)


exports.getPatisserieBusiness = asyncHandler(
    async (req,res,next)=>{

        // get trending business based on reviews
        const business = await businessModel.find();
        console.log(business);
        let patisserieArray = [];
        let patisserieBusiness;

        if(!business) {
                    return next(new ErrorApi(`no business Founded in database` , 404));
                }

        // restaurant business 
                business.findIndex(element => {
                    let result
                        result = element.categories_id.forEach(category=>{
                        if(category.category_name == 'patisserie') {
                            patisserieArray.push(element)
                        }
                    })
                    
                });
                
                patisserieBusiness = patisserieArray;
        res.status(200).json({patisserieBusiness, status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)


exports.getIceCreamShopBusiness = asyncHandler(
    async (req,res,next)=>{

        // get trending business based on reviews
        const business = await businessModel.find();
        console.log(business);
        let iceCreamArray = [];
        let iceCreamShopBusiness;

        if(!business) {
                    return next(new ErrorApi(`no business Founded in database` , 404));
                }

        // restaurant business 
                business.findIndex(element => {
                    let result
                        result = element.categories_id.forEach(category=>{
                        if(category.category_name == 'ice cream') {
                            iceCreamArray.push(element)
                        }
                    })
                    
                });
                
                iceCreamShopBusiness = iceCreamArray;
        res.status(200).json({iceCreamShopBusiness, status: 'success' , msg: 'All Business is Returned Successfully'})
    }
)