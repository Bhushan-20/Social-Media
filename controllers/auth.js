const User = require("../models/User")
const bcrypt = require("bcrypt");
const JWT= require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");
require("dotenv").config();

//Registration
exports.registration = async (req,res,next) => {
    try{   
        const {username,email,password,fullname,bio} = req.body;
        const existingUser = await User.findOne({email});

        if(existingUser){
           throw new CustomError("User Already exists!!",400);
        }

        //secure Password method 1
        // let hashPassword;
        // try{
        //     hashPassword = await bcrypt.hash(password,10);
        // }
        // catch(error){
        //     return res.status(500).json({
        //         success:false,
        //         message:"Can't Hash Password"
        //     })
        // }

        //Method 2
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hashSync(password,salt);

        const user = await User.create({...req.body,password:hashPassword}) 
        const savedUser = await user.save();

        return res.status(200).json({
            success:true,
            message:"Registered Successfully"
        })

    }
    catch(error){
        next(error);
    }
}

//Login
exports.login = async (req,res,next) => {
    try{
        let user;
        
        if(req.body.email){
            user = await User.findOne({email:req.body.email});
        }
        else{
            user = await User.findOne({username:req.body.username});
        }  

        // if(!email || !password || !username){
        //     return res.status(400).json({
        //         success:false,
        //         message:"Fill All Details Properly"
        //     })
        // }

        if(!user){
           throw new CustomError("User Not Found!",404);
        }

        const match = await bcrypt.compare(req.body.password,user.password);

        if(!match){
            throw new CustomError("Incorrect Username or Password",401);
        }
        // const payload = {
        //     email:user.email,
        //     id:user._id,
        // }

        const {password,...data} = user._doc;
        const token = JWT.sign( {_id:user._id},process.env.JWT_SECRET,{expiresIn:"2h"});

        res.cookie("token",token).status(200).json({
            success:true,
            token,
            user,
            data,
            message:"Logged In Successfully"    
        })
    }
    catch(error){
        // console.log(error)
        // return res.status(500).json({
        //     success:false,
        //     message:"LogIn Failed"
        // })
        next(error);
    }
}

//LogOut
exports.logout = async (req,res,next) => {
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).json({
            success:true,
            message:"LogOut Successfully"
        })
    }
    catch(error){
        // console.error(error)
        // res.status(500).json({
        //     success:false,
        //     message:"LogOut Failed"
        // })
        next(error);
    }
}

//Fetch Current User
exports.fetchUser = async (req,res,next) => {
    const token = req.cookies.token
    JWT.verify(token,process.env.JWT_SECRET,{},async(err,data)=>{
        if(err){
            throw new CustomError(err,404)
        }
        console.log(data)
        try{
            const id =data._id
            const user =  await User.findOne({_id:id})
            console.log(user)
            res.status(200).json(user);
        }
        catch(error)
        {
            next(error)
        }
        
    })
    
}