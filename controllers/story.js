const User = require("../models/User");
const Post = require("../models/Post");
const Story = require("../models/Story")
const { CustomError } = require("../middlewares/error");
const router = require("../routes/storiesRoute");
require("dotenv").config();

//Create Story
exports.createStory = async(req,res,next) => {
    const {userId} = req.params;
    const {text} = req.body;

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }

        let image="";
        if(req.file){
            image = process.env.PORT + `/postStory/${req.file.filename}`
        }
        
        const newStory = new Story({
            user:userId,
            image,
            text
        })

        await newStory.save();
        res.status(200).json({
            success:true,
            message:"Story Added",
            newStory
        })

    }
    catch(error){
        next(error);
    }
}

//Get All Stories
exports.getAllStories = async(req,res,next) => {
    const{userId} = req.params;

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }

        const followingUser = user.following
        const stories = await Story.find({user:{$in:followingUser}}).populate("user","username fullname profilePicture");
        res.status(200).json({
            success:true,
            message:"Fetched ALl Stories",
            stories
        })
    }
    catch(error){

    }
}

//Get User Stories
exports.getUserStories = async(req,res,next) =>{
    const {userId} = req.params;

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found");
        }

        const stories = await Story.find({user:userId}).populate("user","username fullname profilePicture");

        res.status(200).json({
            success:true,
            stories
        })
    }catch(error){
        next(error);
    }
}

//Delete Story
exports.deleteStory = async (req,res,next) => {
    const {storyId} = req.params;

    try{
        const deleteStory = await Story.findByIdAndDelete(storyId);
        res.status(200).json({
            success:true,
            message:"Story Deleted Successfully",
        })
    }
    catch(error){
        next(error)
    }
}

//Delete All Stories
exports.deleteStories = async(req,res,next) => {
    const {userId} = req.params;

    try{
         await Story.deleteMany({user:userId});
        res.status(200).json({
            success:true,
            message:"All Stories Deleted Successfully",
        })
    }
    catch(error){
        next(error)
    }
}