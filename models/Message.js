const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

const Message = mongoose.model("Message",MessageSchema);

module.exports = Message