const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { CustomError } = require("../middlewares/error");
const router = require("../routes/commentRoute");
require("dotenv").config();

//Create Comment
exports.createComment = async (req,res,next) => {
    const {postId,userId,text} = req.body;

    try{
        const post = await Post.findById(postId);
        if(!post){
            throw new CustomError("Post Not Find",404);
        }
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found",404);
        }

        const newComment = new Comment({
            user:userId,
            post:postId,
            text,
        });

        const saveComment = await newComment.save();
        const updatePost = await Post.findByIdAndUpdate(post,{$push:{comment:saveComment._id}},{new:true}).populate("comment").exec();
        // post.comment.push(newComment._id);
        // await post.save();

        res.status(200).json({
            success:true,
            message:"Comment added Successfully",
            comment:newComment,
            post:updatePost
        })


    }
    catch(error){
        next(error);
    }
}

//Create Reply To Comment
exports.replyToComment = async (req,res,next) => {
    const {commentId} = req.params;
    const {userId,text} = req.body;

    try{
        const parentComment = await Comment.findById(commentId);
        if(!parentComment){
            throw new CustomError("Comment Not Found",404);
        }

        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found");
        }

        const reply = {
            text,
            user:userId
        }

        parentComment.replies.push(reply);
        await parentComment.save();
        res.status(200).json({
            message:"Reply Created Successfully",
            reply
        })
        
    }
    catch(error){
        next(error);
    }
}

//Update Comment
exports.updateComment = async(req,res,next) => {
    const {commentId} = req.params;
    const {text} = req.body
    try{
        const commentToUpdate = await Comment.findById(commentId);
        if(!commentToUpdate){
            throw new CustomError("Comment Not Found!",404);
        }

        const updateComment = await Comment.findByIdAndUpdate(commentId,{text},{new:true});
        res.status(200).json({
            success:true,
            message:"Comment Updated Successfully",
            updateComment
        })

    }
    catch(error){
        next(error);
    }
}

//Update Reply Comment
exports.updatedReplyComment = async(req,res,next) => {
    const {commentId,replyId} = req.params;
    const {text,userId} = req.body;
    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        const replyIndex = comment.replies.findIndex((reply)=>reply._id.toString() === replyId);
        if(replyIndex===-1){
            throw new CustomError("Reply Not Found",404);
        }

        if(comment.replies[replyIndex].user.toString() !== userId){
            throw new CustomError("You Can only Update your Comment",400);
        }   

        comment.replies[replyIndex].text = text
        await comment.save()
        res.status(200).json({
            success:true,
            message:"Reply Updated Successfully",
            comment
        })

    }catch(error){
        next(error)
    }
}

//GET all Post comments
const populateUserDetails = async(comments) => {
    for (const comment of comments){
        await comment.populate("user","username fullname profilePicture")
        if(comment.replies.lenght>0){
            await comment.populate("replies.user","username fullname profilePicture")
        }
    }

}
exports.getPostComments = async(req,res,next) => {
    const {postId} = req.params
    try{
        const post = await Post.findById(postId);
        if(!post){
            throw new CustomError("Post Not Found");
        }

        const comments = await Comment.find({post:postId});
        await populateUserDetails(comments)

        res.status(200).json({
            success:true,
            comments
        })
    }
    catch(error){
        next(error)
    }
}

//Delete Comments
exports.deleteComment = async (req,res,next) => {
    const {commentId} = req.params;

    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        await Post.findOneAndUpdate({comment:commentId},{$pull:{comment:commentId}},{new:true})
        await comment.deleteOne()
        res.status(200).json({
            success:true,
            message:"Comment Deleted Successfully",
        })

    }
    catch(error){
        next(error)
    }
}

//Delete Reply Comment
exports.deleteReplyComment = async (req, res, next) => {
    const { commentId, replyId } = req.params;

    try {
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { replies: { _id: replyId } } },
            { new: true }
        );

        if (!comment) {
            throw new CustomError("Comment Not Found!", 404);
        }

        res.status(200).json({
            success: true,
            message: "Replied Comment Deleted Successfully"
        });
    } catch (error) {
        next(error);
    }
};

//Like A Comment
exports.likeComment = async (req,res,next) => {
    const {commentId} = req.params;
    const {userId} = req.body

    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        if(comment.likes.includes(userId)){
            throw new CustomError("Already Liked Comment");
        }

        comment.likes.push(userId);
        await comment.save();

        res.status(200).json({
            success:true,
            message:"Comment Liked Successfully",
            comment
        })
        
    }
    catch(error){
        next(error);
    }
}

//Dislike A Comment
exports.dislikeComment = async (req,res,next) => {
    const {commentId} = req.params;
    const {userId} = req.body

    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        if(!comment.likes.includes(userId)){
            throw new CustomError("You have not Liked Comment");
        }

        comment.likes = comment.likes.filter(id=>id.toString()!==userId);
        comment.save();

        res.status(200).json({
            success:true,
            message:"Comment Disliked Successfully",
            comment
        })
        
    }
    catch(error){
        next(error);
    }
}

//Like A Reply Comment
exports.likeReplyComment = async(req,res,next) => {
    const {commentId,replyId} = req.params;
    const {userId} = req.body;

    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        const replyComment = comment.replies.id(replyId);
        if(!replyComment){
            throw new CustomError("Reply Comment not Found",404);
        }

        if(replyComment.likes.includes(userId)){
            throw new CustomError("Already Liked Reply Comment",400);
        }

        replyComment.likes.push(userId)
        await comment.save();
        res.status(200).json({
            success:true,
            message:"Reply Comment Liked Successfully",
            replyComment
        })
    }
    catch(error){
        next(error);
    }
}

//Dislike Reply Comment
exports.dislikeReplyComment = async(req,res,next) => {
    const {commentId,replyId} = req.params;
    const {userId} = req.body

    try{
        const comment = await Comment.findById(commentId);
        if(!comment){
            throw new CustomError("Comment Not Found!",404);
        }

        const replyComment = comment.replies.id(replyId);
        if(!replyComment){
            throw new CustomError("Reply Comment not Found",404);
        }

        if(!replyComment.likes.includes(userId)){
            throw new CustomError("Not Liked Reply Comment",400);
        }

        replyComment.likes = replyComment.likes.filter(id=>id.toString() !== userId);
        await comment.save();
        res.status(200).json({
            success:true,
            message:"Disliked Reply Comment Successfully",
            comment
        })
    }
    catch(error){
        next(error);
    }
}