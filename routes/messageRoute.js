const express = require("express")
const router = express.Router();

const {createMessage,getMessage,deleteMessage} = require("../controllers/Message");

//Create Message
router.post("/create",createMessage);

//Get Message
router.get("/:conversationId",getMessage)

//Delete Message
router.delete("/delete/:messageId",deleteMessage)




module.exports = router;