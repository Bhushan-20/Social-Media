const JWT = require("jsonwebtoken");
const { CustomError } = require("./error");
require("dotenv").config();

const verifyToken = (req,res,next) => {
    const token = req.cookies.token
    if(!token){
        throw new CustomError("You are not Authenticated",401)
    }

    JWT.verify(token,process.env.JWT_SECRET,async(err,data)=>{
        if(err){
            throw new CustomError("Token is invalid!",403);
        }

        req.userId = data._id;
        next();
    })
}

module.exports = verifyToken