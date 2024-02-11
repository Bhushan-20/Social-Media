const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const {errorHandler} = require("./middlewares/error");



require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cookieParser());

//Routes
const authroute = require("./routes/authroute");
app.use("/api/v1/auth",authroute);

const userRoute = require("./routes/userRoute");
app.use("/api/v2/user",userRoute);

const db = require("./config/database");
db.connect();

app.listen(PORT,()=>{
    console.log(`Server Connected successfully at ${PORT}`);
})