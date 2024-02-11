const { CustomError } = require("../middlewares/error");
const User = require("../models/User")

//Get User
exports.getUser = async (req,res,next) => {
    const {userId} = req.params

    try{
        const user = await User.findById(userId);
        if(!user){
            throw new CustomError("No User Found")
        }
        const {password,...data} = user._doc;
        res.status(200).json(data)
    }
    catch(error){
        next(error);
    }

}

//Update User
exports.updateUser = async (req,res,next) => {
    const {userId} = req.params;
    const updateData = req.body;

    try{
        const userToUpdate = await User.findById(userId);
        if(!userToUpdate){
            throw new CustomError("User Not Found");
        }
        Object.assign(userToUpdate,updateData);
        await userToUpdate.save();
        res.status(200).json({
            message:"User Updated Successfully",
            user:userToUpdate
        })
    }
    catch(error){
        next(error);
    }
}
