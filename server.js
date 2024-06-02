// core Module
const path = require("path");
// third Party Module 
const express = require("express");
const bodyParser= require("body-parser");
const dotenv =  require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
// user-defined Module
const dbConnection = require('./config/databaseConnection');
const authRoute = require("./routes/auth/authRoute");
// const loginRoute = require("./routes/login/userLoginRoute");
const usersRoute = require("./routes/users/UserRoutes");
const categoryRoute = require("./routes/categories/CategoryRoute");
const businessRoute = require("./routes/business/businessRoutes");
const collectionRoute = require("./routes/collections/collectionRoute");
const itemRoute = require("./routes/items/itemRoute");
const sectionRoute = require("./routes/sections/sectionRoute");
const menuRoute = require("./routes/menus/menuRoute");
const homeRoute = require("./routes/dashboard/home/homeRoute");
const menuMangerRoute = require("./routes/dashboard/menuManger/menuMangerRoute");
const businessMangerRoute = require("./routes/dashboard/businessManger/businessMangerRoute");
const reviewRoute = require("./routes/reviews/reviewRoute");
const cashSystemRoute = require("./routes/dashboard/cashSystem/cashSystemRoute");
const ErrorApi = require("./utils/Errors/errorAPI");
const centerErrorMiddleware = require("./middlewares/globalError");




// initialize dotenv config 
dotenv.config();
// create node app from express 
const app = express();
// set port from env file 
const PORT = process.env.PORT;
// middleware 
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// make express serve static files 
app.use(express.static(path.join(__dirname,'uploads')))
// check node environment 
if(process.env.NODE_ENV == "development") {
    app.use(morgan('dev'));
    console.log(`Node Mode is ${process.env.NODE_ENV}`);
}

// db connection 
dbConnection();


//Mount  routes / apis 
// app.use('/categories',categoryRoute)
app.use('/auth' , authRoute);
// mount login route 
// app.use('/', loginRoute);
// mount users route 
app.use('', usersRoute);
// mount categories route 
app.use('/categories/create' , categoryRoute);
app.use('' , categoryRoute);

// mount collection route 
app.use('',collectionRoute);
// mount item route 
app.use('',itemRoute)
// mount section route 
app.use('',sectionRoute)
// mount menu route 
app.use('',menuRoute)
// mount dashboardRoute
app.use('',homeRoute)
app.use('',menuMangerRoute)
app.use('',businessMangerRoute)
// mount business route 
app.use('',businessRoute);
// mount CashSystem route 
app.use('',cashSystemRoute);
// review
app.use('',reviewRoute)


// handle error for unhandled routes 
app.all("*" , (req,res,next)=>{
    // const error = new Error(`Sorry! This Route Not Found ${req.originalUrl}`);
    // for passing error to next middleware "global middleware" must use next() that next to middleware - passing error.message to next as a parameter
    // next(error.message); 
    next(new ErrorApi(`Sorry! This Route Not Found ${req.originalUrl}` , 400))
})

// global middleware -> must be provide 4 parameters [error , req , res , next]
app.use(centerErrorMiddleware)


const server = app.listen(PORT, ()=> {
    console.log(`Server is running on Port ${PORT}`);
});

// handle error outside express 

process.on("unhandledRejection" , (err)=>{
    console.log(`Erorr Rejection: ${err}`);
    server.close(()=>{
        console.log(`Server is closed`);
        process.exit(1);
    })
})