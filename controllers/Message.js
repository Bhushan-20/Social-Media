const Conversation = require("../models/Conversation");
const Message = require("../models/Message")
const { CustomError } = require("../middlewares/error");
const router = require("../routes/messageRoute");

// //Create Message

exports.createMessage = async (req, res, next) => {
    const newMessage = new Message(req.body);
    
    try {
        // Check if sender and receiver are participants in the conversation
        const conversation = await Conversation.findById(req.body.conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        if (
            conversation.participant.includes(req.body.sender) //Check if sender is a participant
        ) {
            const saveMessage = await newMessage.save();
            res.status(201).json({
                message: "Message Sent",
                saveMessage
            });
        } else {
            return res.status(403).json({ message: "You are not authorized to send a message to this user" });
        }
    } catch (error) {
        next(error);
    }
};

//Get Message
exports.getMessage = async(req,res,next)=>{
    const {conversationId} = req.params;
    try{
        const message = await Message.find({conversationId:conversationId})

        res.status(200).json({
            success:true,
            message
        })

    }catch(error){
        next(error)
    }
}

//Delete Message
exports.deleteMessage = async(req,res,next) =>{
    const {messageId} = req.params;

    try{
        await Message.findByIdAndDelete(messageId);
        res.status(200).json({
            message:"Message Deleted"
        })
    }
    catch(error){
        next(error);
    }
}