const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    participant:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }]
},{timestamps:true})

const Conversation = mongoose.model("Conversation",ConversationSchema);

module.exports = Conversation

