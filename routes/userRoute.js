const express = require("express")
const router = express.Router();

const {getUser,updateUser,followUser} = require("../controllers/User");

//Get User
router.get("/:userId",getUser);

//Update user
router.put("/update/:userId",updateUser);

//Follow User
router.post("/follow/:userId",followUser)






module.exports = router;