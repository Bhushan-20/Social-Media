const User = require("../models/User")
const Post = require("../models/Post");
const { CustomError } = require("../middlewares/error");
require("dotenv").config();

//Create Post
exports.createPost = async (req,res,next) => {
    const {userId,caption} = req.body;
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }
        const newPost = new Post({
            user:userId,
            caption
        })

        await newPost.save();
        user.posts.push(newPost._id);
        await user.save();

        res.status(200).json({
            success:true,
            post:newPost,
            message:"Post Added Successfully"
        })
    }
    catch(error){

    }
}
const generateFileUrl = (filename) => {
    return process.env.PORT + `/postsimage/${filename}`;
}
//Create Post with Images
exports.createPostwithImages = async (req,res,next) => {
    const {userId} = req.params;
    const {caption} = req.body;
    const files = req.files

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }

        const imageUrl = files.map(file=>generateFileUrl(file.filename))
        const newPost = new Post({
            user:userId,
            caption,
            image:imageUrl
        })

        await newPost.save();
        user.posts.push(newPost._id);
        await user.save();
        res.status(201).json({
            success:true,
            message:"Post Created Successfully",
            post:newPost
        })
    }
    catch(error){
        next(error);
    }
}
//Update Post
exports.updatePost = async (req,res,next) => {
    const {postId} = req.params
    const{caption} = req.body
    try{
        const postToUpdate = await Post.findById(postId);
        if(!postToUpdate){
            throw new CustomError("Post Not Found",404);
        }
        const updatedPost = await Post.findByIdAndUpdate(postId,{caption},{new:true});
        await postToUpdate.save();
        res.status(200).json({
            success:true,
            message:"Post Updated Successfully",
            post:updatedPost
        })
    }
    catch(error){
        next(error);
    }
}
//Get All Posts
exports.getPosts = async(req,res,next) => {
    const {userId} = req.params
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found");
        }
        const blockedUser = user.blockList.map(id=>id.toString())
        const allPost = await Post.find({user:{$nin:blockedUser}}).populate("user","username fullname profilePicture")
        res.status(200).json({
            success:true,
            posts:allPost
        })

    }catch(error){
        next(error)
    }
}

//Get User Posts
exports.getUserPost = async (req,res,next) => {
    const {userId} = req.params

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found");
        }
        const userPosts = await Post.find({user:userId})
        res.status(200).json({
            success:true,
            posts:userPosts
        })

    }catch(error){
        next(error)
    }
}

//Delete Post
exports.deletePost = async (req,res,next) => {
    const {postId} = req.params

    try{
        const postTodelete = await Post.findById(postId);
        if(!postTodelete){
            throw new CustomError("Post Not Find",404);
        }

        const user = await User.findById(postTodelete.user)
        if(!user){
            throw new CustomError("User Not Found",404);
        }
        user.posts = user.posts.filter(postId=>postId.toString()!==postTodelete._id.toString())
        await user.save();
        await postTodelete.deleteOne();

        res.status(200).json({
            message:"Post Deleted Successfully"
        })
    }
    catch(error){
        next(error)
    }
}

//Like Post
exports.likePost = async (req,res,next) => {
    const {postId} = req.params;
    const {userId} = req.body
    try{
        const post = await Post.findById(postId).populate("likes","username fullname");
        if(!post){
            throw new CustomError("Post Not Find",404);
        }
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }
        if(post.likes.includes(userId)){
            throw new CustomError("Already Liked The Post");
        }
        post.likes.push(userId);
        await post.save()
        res.status(200).json({
            success:true,
            message:"Post Liked Successfully",
            post
        })

    }catch(error){
        next(error);
    }
}