const express = require("express");
const User = require("../models/User");
const File = require("../models/File");

const router = express.Router();

const StatusCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    VALUE_TAKEN: 409,
    FILE_CREATION_FAILED: 500,
    INTERNAL_ERROR: 500,    
};

// get all files in db
// does not differentiate between public and private files yet
// should that be in community get?
router.get("/all", async (req, res) => {
    try {
        const files = await File.find({}).populate([
            { path: 'ownerName', model: 'User', select: 'name username' },
            { path: 'lastModifiedBy', model: 'User', select: 'name username' },
            { path: 'comments', model: 'Comment'} //, populate: { path: 'user', model: 'User' } } for future implementation
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
        const files = await File.find({ownerName: req.session.username}).populate([
            { path: 'ownerName', model: 'User', select: 'name username' },
            { path: 'lastModifiedBy', model: 'User', select: 'name username' },
            { path: 'comments', model: 'Comment'} //, populate: { path: 'user', model: 'User' } } for future implementation
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
        const file = await File.find({ 
            ownerName: req.session.username, 
            fileName: req.body.fileName
            }).populate([
                { path: 'ownerName', model: 'User', select: 'name username' },
                { path: 'lastModifiedBy', model: 'User', select: 'name username' },
                { path: 'comments', model: 'Comment'} //, populate: { path: 'user', model: 'User' } } for future implementation
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
        const liked = await User.findOne({username: req.session.username}, 'likedFiles').populate('likedFiles').exec();
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

// creates a file, for now files are empty until we deal with uploads
// defaults to public and "main" folder 
// need to have unique filename for the same folder 
// need to have unique folder for the same owner 
router.post("/create", async(req, res) => {
    const {fileName, public, folder, text, description} = req.body;
    if (!fileName) {
        return res
          .status(StatusCodes.FILE_CREATION_FAILED)
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
        await user.files.push(newFile._id);
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
          .status(StatusCodes.FILE_CREATION_FAILED)
          .json({ error: "File creation failed due to internal server error." });
      }
});

// delete one file from database
// to work needs two fields plus user session
// the fields are the file name and folder
router.post("/delete/one", async (req, res) => {
    const {fileName, folder} = req.body;
    const user = await User.findOne({username:req.session.username});
    if (!fileName || !folder){
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({error: "Insufficient information to delete file!"});
    }
    const file = await File.findOneAndDelete({
        fileName: fileName,
        folder: folder,
        ownerName: user._id
    });
    if (file  == null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found!" });
    }
    await user.files.pull(file._id);
    await user.save();
    return res.json(file);
});

module.exports = router;
