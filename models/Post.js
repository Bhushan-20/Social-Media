const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    caption:{
        type:String,
        trim:true,
    },
    image:[{
        type:String,
        required:false,
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},{timestamps:true});

const Post = mongoose.model("Post",PostSchema);
module.exports = Post;