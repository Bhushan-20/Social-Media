const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = async () =>{
   try{
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("DATABASE CONNECTED!!")
   }
   catch(error){
    console.log("Database not connected")
   }
};