const express = require("express")
const router = express.Router();
const upload = require("../middlewares/uploadStory");

const{createStory,getAllStories,getUserStories,deleteStory,deleteStories} = require("../controllers/story");


//Create Story
router.post("/create/:userId",upload.single("image"),createStory)

//Get All Stories
router.get("/all/stories/:userId",getAllStories)

//Get User Stories
router.get("/user/stories/:userId",getUserStories);

//Delete Story
router.delete("/delete/:storyId",deleteStory)

//Delete Stories
router.delete("/delete/stories/:userId",deleteStories)





module.exports = router;