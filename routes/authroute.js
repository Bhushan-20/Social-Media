const express = require("express")
const router = express.Router();

const {registration,login,logout,fetchUser} = require("../controllers/auth");


//routes
router.post("/register",registration);
router.post("/login",login);
router.get("/logout",logout);
router.get("/fetchuser",fetchUser);


module.exports = router;