const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const {errorHandler} = require("./middlewares/error");
const path = require("path")


require("dotenv").config();
const PORT = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname,"uploads")))
app.use("/postsimage",express.static(path.join(__dirname,"postsimage")))
app.use("/postStory",express.static(path.join(__dirname,"postStory")))

//Routes
const authroute = require("./routes/authroute");
app.use("/api/v1/auth",authroute);

const userRoute = require("./routes/userRoute");
app.use("/api/v2/user",userRoute);

const postRoute = require("./routes/postRoute");
app.use("/api/v3/post",postRoute);

const commentRoute = require("./routes/commentRoute");
app.use("/api/v4/comment",commentRoute);

const storyRoute = require("./routes/storiesRoute");
app.use("/api/v5/story",storyRoute);

//Database Connection
const db = require("./config/database");
db.connect();

app.listen(PORT,()=>{
    console.log(`Server Connected successfully at ${PORT}`);
})