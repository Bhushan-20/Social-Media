const express = require("express")
const router = express.Router();

const {createComment,replyToComment,updateComment,updatedReplyComment,
        getPostComments,deleteComment,deleteReplyComment,
        likeComment,dislikeComment,likeReplyComment,dislikeReplyComment} = require("../controllers/comment")

//Create Comment
router.post("/create",createComment);

//Create Reply To Comment
router.post("/create/reply/:commentId",replyToComment);

//Update Comment
router.put("/update/:commentId",updateComment);

//Update reply comment
router.put("/update/:commentId/replies/:replyId",updatedReplyComment);

//GET all Post comments
router.get("/post/:postId",getPostComments)

//Delete Comment
router.delete("/delete/:commentId",deleteComment)

//Delete a reply comment
router.delete("/delete/:commentId/reply/:replyId",deleteReplyComment)

//Like Comment
router.post("/like/:commentId",likeComment)

//dislike comment
router.post("/dislike/:commentId",dislikeComment)

//Like A Reply Comment 
router.post("/:commentId/like/reply/:replyId",likeReplyComment)

//Dislike Reply Comment
router.post("/:commentId/dislike/reply/:replyId",dislikeReplyComment)



module.exports = router;