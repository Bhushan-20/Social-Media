const express = require("express")
const router = express.Router();

const {getUser,updateUser,followUser,unFollowUser,
    blockUser,unBlockUser,BlockedUserList,deleteUser,searchUser,
    uploadProfilePicture,uploadCoverPicture} = require("../controllers/User");
const upload = require("../middlewares/upload");


//Get User
router.get("/:userId",getUser);

//Update user
router.put("/update/:userId",updateUser);

//Follow User
router.post("/follow/:userId",followUser)

//Unfollow User
router.post("/unfollow/:userId",unFollowUser);

//Block User
router.post("/block/:userId",blockUser);

//Unblock User
router.post("/unblock/:userId",unBlockUser)

//Get Blocked User
router.get("/blocked/:userId",BlockedUserList)

//Delete User
router.delete("/delete/:userId",deleteUser);

//Search User
router.get("/search/:query",searchUser)

//Update Profile Picture
router.put("/update-profile-picture/:userId", upload.single("profilePicture"), uploadProfilePicture);

//Update Cover Picture
router.put("/update-cover-picture/:userId", upload.single("coverPicture"), uploadCoverPicture);



module.exports = router;