const express = require("express")
const router = express.Router();

const {getUser,updateUser,followUser,unFollowUser,
    blockUser,unBlockUser,BlockedUserList,deleteUser,searchUser} = require("../controllers/User");

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
router.post("/")






module.exports = router;