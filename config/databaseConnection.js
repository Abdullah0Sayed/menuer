
const mongoose = require("mongoose");
const dotenv =  require("dotenv");

function dbConnection() {
    // initialize dotenv config 
dotenv.config();
    mongoose.connect(process.env.DB_URI).then((conn)=>{
        console.log(`DB Connected: ${conn.connection.host}`);
    }).catch((err)=>{
        console.error(`DB error ${err}`);
        process.exit(1);
    });
}
module.exports = dbConnection;