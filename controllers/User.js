const { CustomError } = require("../middlewares/error");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Story = require("../models/Story");

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
//Follow User
exports.followUser = async(req,res,next) =>{
    const {userId} = req.params;
    const {_id} = req.body

    try{
        if(userId === _id){
            throw new CustomError("You Cannot follow yourself",500);
        }

        const userToFollow = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if(!userToFollow || !loggedInUser){
            throw new CustomError("User Not Found!!",404);
        }

        if(loggedInUser.following.includes(userId)){
            throw new CustomError("Already Following User",400);
        }

        if (loggedInUser.blockList.includes(userId)) {
            throw new CustomError("You cannot follow a blocked user", 400);
        }

        loggedInUser.following.push(userId);
        userToFollow.followers.push(_id);

        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
            message:"Successfully Followed User"
        })
    }
    catch(error){
        next(error);
    }
}
//Unfollow User
exports.unFollowUser = async (req,res,next) => {
    const {userId} = req.params;
    const {_id} = req.body

    try{
        if(userId === _id){
            throw new CustomError("You Cannot Unfollow yourself",500);
        }

        const userToUnfollow = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if(!userToUnfollow || !loggedInUser){
            throw new CustomError("User Not Found!!",404);
        }

        if(!loggedInUser.following.includes(userId)){
            throw new CustomError("Not Following This User",400);
        }

        loggedInUser.following = loggedInUser.following.filter(id=>id.toString()!==userId);
        userToUnfollow.followers = userToUnfollow.followers.filter(id=>id.toString()!==_id);

        await loggedInUser.save();
        await userToUnfollow.save();

        res.status(200).json({
            message:"Unfollowed User Successfully"
        })
    }
    catch(error){
        next(error);
    }
}
//Blocked User
exports.blockUser = async (req, res, next) => {
    const { userId } = req.params;
    const { _id } = req.body;

    try {
        if (userId === _id) {
            throw new CustomError("You Cannot block Yourself", 500);
        }

        const userToBlock = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToBlock || !loggedInUser) {
            throw new CustomError("User Not Found!!", 404);
        }

        if (loggedInUser.blockList.includes(userId)) {
            throw new CustomError("Already Blocked", 400);
        }

        loggedInUser.blockList.push(userId);
        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== userId);
        userToBlock.followers = userToBlock.followers.filter(id => id.toString() !== _id);

        await loggedInUser.save();
        await userToBlock.save();

        res.status(200).json({
            message: "Blocked User Successfully"
        });

    } catch (error) {
        next(error);
    }
}
//UNBLOCK USER
exports.unBlockUser = async(req,res,next) => {
    const { userId } = req.params;
    const { _id } = req.body;

    try{
        if (userId === _id) {
            throw new CustomError("You Cannot Unblock Yourself", 500);
        }

        const userToUnBlock = await User.findById(userId);
        const loggedInUser = await User.findById(_id);

        if (!userToUnBlock || !loggedInUser) {
            throw new CustomError("User Not Found!!", 404);
        }

        if (!loggedInUser.blockList.includes(userId)) {
            throw new CustomError("Already UnBlocked", 400);
        }

        loggedInUser.blockList = loggedInUser.blockList.filter(id => id.toString() !== userId);

        await loggedInUser.save();

        res.status(200).json({
            message: "UnBlocked User Successfully"
        });
    }
    catch(error){

    }
}
//Get Blocked User List
exports.BlockedUserList = async(req,res,next) => {
    const { userId } = req.params;    
    try{
        const user = await User.findById(userId).populate("blockList","username fullname profilePicture");

        if(!user){
            throw new CustomError("User Not Found",404);
        }

        const {blockList,...data} = user;
        res.status(200).json({
            blockList,
            message:"Blocked List"
        })

    }
    catch(error){
        next(error);
    }
}
//Delete User
exports.deleteUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const userToDelete = await User.findById(userId);

        if (!userToDelete) {
            throw new CustomError("User Not Found", 404);
        }

        // Get the followers of the user to be deleted
        const followersToUpdate = await User.find({ followUser: userId });

        // Remove the user to be deleted from followers lists of users who are following the user to be deleted
        await Promise.all(
            followersToUpdate.map(async (follower) => {
                follower.followUser = follower.followUser.filter(
                    (followedUserId) => followedUserId.toString() !== userId
                );
                await follower.save();
            })
        );

        // Update the followUser lists of users who are followed by the user to be deleted
        await User.updateMany(
            { followUser: userId },
            { $pull: { followUser: userId } }
        );

        // Delete posts and comments associated with the user
        await Post.deleteMany({ user: userId });
        await Post.deleteMany({ "comments.user": userId });
        await Post.deleteMany({ "comments.replies.user": userId });
        await Comment.deleteMany({ user: userId });
        await Story.deleteMany({ user: userId });

        // Update users who are following the deleted user
        await User.updateMany(
            { _id: { $in: userToDelete.following } },
            { $pull: { followUser: userId } }
        );

        // Update posts and comments to remove likes from the deleted user
        await Comment.updateMany({}, { $pull: { likes: userId } });
        await Comment.updateMany(
            { "replies.likes": userId },
            { $pull: { "replies.likes": userId } }
        );
        await Post.updateMany({}, { $pull: { likes: userId } });

        // Remove the deleted user from reply comments
        const replyComments = await Comment.find({ "replies.user": userId });

        await Promise.all(
            replyComments.map(async (comment) => {
                comment.replies = comment.replies.filter(
                    (reply) => reply.user.toString() !== userId
                );
                await comment.save();
            })
        );

        // Finally, delete the user
        await userToDelete.deleteOne();

        res.status(200).json({
            success: true,
            message: "Everything Associated with User is Deleted Successfully",
        });
    } catch (error) {
        next(error);
    }
};
// Search User
exports.searchUser = async (req, res, next) => {
    try {
        // Extract query from request parameters
        const { query } = req.params;

        // Ensure query is provided
        if (!query) {
            throw new CustomError("Search query is required", 400);
        }

        // Search for users with provided query
        const users = await User.find({
            $or: [
                { username: { $regex: new RegExp(query, 'i') } },
                { fullname: { $regex: new RegExp(query, 'i') } }
            ]
        });

        // Check if users were found
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found with the provided query"
            });
        }

        // Respond with found users
        res.status(200).json({
            success: true,
            users,
            message: "Users found successfully"
        });
    } catch (error) {
        // Pass error to error handling middleware
        next(error);
    }
};
