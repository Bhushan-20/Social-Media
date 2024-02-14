const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploadPost");

const {createPost,createPostwithImages,updatePost,getPosts,getUserPost,
        deletePost,likePost,unLikePost} = require("../controllers/Post");

//Create Post
router.post("/create",createPost);

//Create Post with images
router.post("/create/:userId",upload.array("images",5),createPostwithImages)

//Update Post
router.put("/update/:postId",updatePost)

//Get All Posts
router.get("/allposts/:userId",getPosts)

//Get User Posts
router.get("/user/posts/:userId",getUserPost)

//Delete Post
router.delete("/delete/:postId",deletePost)

//Like Post
router.post("/like/:postId",likePost)

//Unlike Post
router.post("/unlike/:postId",unLikePost)

module.exports = router;