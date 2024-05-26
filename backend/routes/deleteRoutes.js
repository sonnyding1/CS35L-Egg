const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const Comment = require("../models/Comment");
const StatusCodes = require("./statusCodes");
const router = express.Router();

/**
 * for development and testing please use the mongodb compass interface
 * these functions are set to handle a singular input, ie delete one object at a time
*/

/**
 * Delete the logged in  user
 * no input neeeded but user has to be logged in
 * when deleted, all related files and comments are also deleted
 * after deleting, need to route to log out to destroy session properly
*/
router.post("/user", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ error: "User not logged in!" });
        }
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "User not found!" });
        }

        // Find and remove user's files
        const userFiles = await File.find({ authorId: user._id });
        for (const file of userFiles) {
            // Remove comments associated with this file
            await Comment.deleteMany({ file: file._id });

            // Remove the file itself
            await File.deleteOne({ _id: file._id });

            // Remove this file from other users' liked files
            await User.updateMany(
                { likedFiles: file._id },
                { $pull: { likedFiles: file._id } }
            );
        }
        // Remove the user
        await User.deleteOne({ _id: req.session.userId });
        return res
            .status(StatusCodes.OK)
            .json({message: "User deleted successfully!"});

    } catch (error) {
        console.error(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Internal Server Error, user deletion failed!" });
    }
});

/**
 * Delete one file
 * file has to be owned by user
 * input needs to be file _id 
 * deleting the file deletes the comments associated with it too 
 */
router.post("/file", async (req, res) => {
   
    try {
        const user = await User.findById(req.session.userId);
        const file = await File.findById(req.body._id);
        if (!user){
            return res 
                .status(StatusCodes.UNAUTHORIZED)
                .json({error:"User not logged in!"});
        }
        if (!file) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "File not found!" });
        }
        if (file.authorId.toString() !== user._id.toString()){
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({error: "File not owned by user!"});
        }

        // Remove comments associated with this file
        await Comment.deleteMany({ file: file._id });
        // Remove the file itself
        await File.deleteOne({ _id: file._id });

        // Remove this file from users files
        await User.updateMany(
            { files: file._id },
            { $pull: { files: file._id } }
        );
  
        // Remove this file from users' likedFiles
        await User.updateMany(
            { likedFiles: file._id },
            { $pull: { likedFiles: file._id } }
        );
        
        return res.status(StatusCodes.OK).json({message: "File deleted successfully!"})

    } catch (error){
        console.log(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error, file deletion failed!" });
    }
});

/**
 * delete one comment, need comment _id to delete comment 
 * comment needs to be written by user 
 * or on a file owned by user 
 */
router.post("/comment", async (req, res) => {
    try{
        const user = await User.findById(req.session.userId);
        const comment = await Comment.findById(req.body._id);
        const file = await File.findById(comment.file);
        if (!user) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({error: "User not logged in!"});
        }
        if (!comment) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: "Comment not found!" });
        }
        if (file.authorId.toString() !== user._id.toString() || comment.authorId.toString() !== user._id.toString()){
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({error: "Not authorized to delete comment!"});
        }
        // delete the comment itself
        await Comment.deleteOne({_id:comment._id});
        // update the file in user array
        await File.updateOne(
            { comments: comment._id },
            { $pull: { comments: comment._id } }
        );

        return res.status(StatusCodes.OK).json({message: "Comment deleted successfully!"});
    } catch (error){
        console.log(error);
        return res
          .status(StatusCodes.CREATION_FAILED)
          .json({ error: "Comment creation failed due to internal server error." });
    }
});

module.exports = router;
