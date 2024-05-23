const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const Comment = require("../models/Comment");
const StatusCodes = require("./statusCodes");
const router = express.Router();



// get all files in db
// does not differentiate between public and private files yet
// should that be in community get?
router.get("/all", async (req, res) => {
    try {
        const files = await File.find({}).populate([
            { path: 'ownerName', model: 'User', select: 'name username' },
            { path: 'lastModifiedBy', model: 'User', select: 'name username' },
            { path: 'comments',
              model: 'Comment', 
              populate: [
                { path: 'author', model: 'User', select: 'name username' }, 
                { path: 'file', model: 'File', select: 'fileName'}
                ]
            }
        ]);
        if (files.length === 0) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No files found!" });
        }
        return res.json(files);
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json({ error: "Internal Server Error" });
    }
});


// get user files
router.get("/user/all", async (req, res) => {
    try {
        const user = await User.findOne({username: req.session.username});
        const files = await File.find({ownerName: user._id}).populate([
            { path: 'ownerName', model: 'User', select: 'name username' },
            { path: 'lastModifiedBy', model: 'User', select: 'name username' },
            { path: 'comments',
              model: 'Comment', 
              populate: [
                { path: 'author', model: 'User', select: 'name username' }, 
                { path: 'file', model: 'File', select: 'fileName'}
                ]
            }
         ]);
        if (files.length === 0){
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No files found!"});
        }
        return res.json(files);  
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json({ error: "Internal Server Error" });
    }
});

// get files that match a file name from a user 
// can have multiple files since they are only 
// unique for folder names 
// can enforce a folder name or "main"?
router.get("/user/one", async(req, res) => {
    try {
        const user = await User.findOne({username: req.session.username});
        const file = await File.find({ 
            ownerName: user._id, 
            $or:[
                {fileName: req.body.fileName},
                {folder: req.body.folder }
            ]
            }).populate([
                { path: 'ownerName', model: 'User', select: 'name username' },
                { path: 'lastModifiedBy', model: 'User', select: 'name username' },
                { path: 'comments',
              model: 'Comment', 
              populate: [
                { path: 'author', model: 'User', select: 'name username' }, 
                { path: 'file', model: 'File', select: 'fileName'}
                ]
            }
         ]);
        if (file.length === 0){
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No file found!"});
        }
        return res.json(file);
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json({ error: "Internal Server Error" });
    }
});

// get files liked by user
router.get("/user-liked/all", async(req, res) => {
    try {
        const liked = await User.findOne({username: req.session.username}, 'likedFiles').populate('likedFiles');
        if (liked.length === 0){
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No file found!"});
        }
        return res.json(liked);
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_ERROR)
        .json({ error: "Internal Server Error" });
    }
});

// defaults to public and "main" folder 
// need to have unique filename for the same folder 
// need to have unique folder for the same owner 
router.post("/create", async(req, res) => {
    const {fileName, public, folder, text, description} = req.body;
    if (!fileName) {
        return res
          .status(StatusCodes.CREATION_FAILED)
          .json("Missing Required Field!");
    }
    try{
        const user = await User.findOne({username:req.session.username});
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error:'User not found'});
          }
        const newFile = new File({
            fileName: fileName,
            public: public,
            folder: folder,
            text: text,
            description: description,
            dateCreated: new Date(),
            lastModified: new Date(),
            lastModifiedBy: user._id,
            ownerName: user._id,
        });
        await newFile.save();
        user.files.push(newFile._id);
        await user.save();
        return res
        .status(StatusCodes.SUCCESS)
        .json(newFile);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
          // 11000 is the error code for duplicate key in MongoDB
          const field = Object.keys(error.keyPattern)[0];
          if (field === "fileName") {
            return res
              .status(StatusCodes.VALUE_TAKEN)
              .json({ error: "File name already exists!" });
          } else if (field === "folder") {
            return res
              .status(StatusCodes.VALUE_TAKEN)
              .json({ error: "Folder already exists!" });
          }
        }
        // If encryption fails
        return res
          .status(StatusCodes.CREATION_FAILED)
          .json({ error: "File creation failed due to internal server error." });
      }
});


// for now we input the file we want to add a comment to
// if we can have a cookie for file then we can discard the input
router.post("/comment/create", async (req, res) =>{
    const {fileName, folder, content} = req.body;
    if (!fileName || !folder){
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({error: "Missing Search Field!"});
    }
    try{
        const user = await User.findOne({username: req.session.username});
        const file = await File.findOne({ownerName: user._id, fileName: fileName, folder: folder});
        const newComment = new Comment({
            file: file._id,
            author: user._id,
            dateCreated: new Date(),
            content: content
        })
        await newComment.save();
        file.comments.push(newComment._id);
        await file.save();
        await user.save();
        return res
        .status(StatusCodes.SUCCESS)
        .json(newComment);
    } catch(error) {
        console.log(error)
        return res
        .status(StatusCodes.CREATION_FAILED)
        .json({ error: "Comment creation failed due to internal server error." });
    }
});

module.exports = router;
