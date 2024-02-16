const express = require("express")
const router = express.Router();

const {newConversation,getConversation,getTwoUserConversation,deleteConversation} = require("../controllers/conversation")

//Create New Conversation
router.post("/create",newConversation);

//Get Conversation
router.get("/user/:userId",getConversation)

//Get Conversation of two users
router.get("/firstuser/:firstUserId/secondUser/:secondUserId",getTwoUserConversation)

//Delete Conversation
router.delete("/delete/:conversationId",deleteConversation)
module.exports = router;