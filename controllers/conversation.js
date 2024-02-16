const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message")
const { CustomError } = require("../middlewares/error");
const router = require("../routes/conversationRoute");
require("dotenv").config();

//Create New Conversation
exports.newConversation = async (req,res,next) => {

    try{
        let newConversation;
        if(req.body.firstUser !== req.body.secondUser){
            newConversation = new Conversation({
                participant:[req.body.firstUser,req.body.secondUser]
            })
        }
        else{
            throw new CustomError("Sender and Receiver can't send",400);
        }

        const saveConversation = await newConversation.save();

        res.status(201).json({
            message:"Conversation Created",
            saveConversation
        })

    }
    catch(error){
        next(error)
    }
}

//Get Conversation
exports.getConversation = async (req,res,next) => {
    const {userId} = req.params;

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("User Not Found")
        }
        const conversation = await Conversation.find({
            participant:{$in:[userId]},
        })

        res.status(200).json(conversation)
    }
    catch(error){
        next(error);
    }
}

//Get Conversation of two users
exports.getTwoUserConversation = async(req,res,next) => {
    const {firstUserId,secondUserId} = req.params
    try{
        
        const conversation = await Conversation.find({
            participant:{$all:[firstUserId,secondUserId]},
        })

        res.status(200).json(conversation)
    }
    catch(error){
        next(error);
    }
}

//Delete Conversation
exports.deleteConversation = async(req,res,next) => {
    const {conversationId} = req.params;

    try{
        await Conversation.deleteOne({_id:conversationId});
        await Message.deleteMany({conversationId:conversationId});

        res.status(200).json({
            success:true,
            message:"Conversation Deleted"
        })

    }
    catch(error){
        next(error)
    }
}