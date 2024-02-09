const express = require("express");
const app = express();


require("dotenv").config();
const PORT = process.env.PORT || 4000;

const db = require("./config/database");
db.connect();

app.listen(PORT,()=>{
    console.log(`Server Connected successfully at ${PORT}`);
})