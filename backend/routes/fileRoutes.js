const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const Comment = require("../models/Comment");
const StatusCodes = require("./statusCodes");
const router = express.Router();

/**
 * File routes file:
 * all get and post functions related to files
 * create, and get files/ comments
 * get folder
 * get liked files  
*/

/**
 *  get all files in db with no restriction, this is for development purposes
 *  the function populates the object fields to make reading easier
*/
router.get("/all", async (req, res) => {
    try {
        const files = await File.find({}).populate([
            { path: 'authorId', model: 'User', select: 'name username' },
            { path: 'comments',
              model: 'Comment', 
              populate: [
                { path: 'authorId', model: 'User', select: 'name username' }, 
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
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
    return res.json(files);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/**
 * get folder of logged in user
 * returns the files pertaining to a certain folder
 * 
 * input types:
 * -- folder name = return files in folder if found
 * -- no input = return files in "Main" (default folder)
 * 
 * no restriction on public or private
 */ 
router.post("/user-folder", async (req, res) =>{
    try {
        const {folder} = req.body;
        const finalFolder = folder || "Main";
        if (!req.session.userId) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: "User not logged in" });
        }
        const currentFolder = await File.find({authorId:req.session.userId, folder:finalFolder });
        if (currentFolder.length === 0) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({error: "Folder - Files not found!"});
        }

        return res
        .status(StatusCodes.OK)
        .json(currentFolder);
        
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error, folder fetch failed" });
    }
    return res.json(files);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/**
 * get certain files of a logged in user 
 * 
 * input types:
 * -- filename only = return all files matching file name 
 * -- filename and folder = return that file if found
 * -- file  _id = return that file if found
 * 
 * if no input is given it will return all user files
 * no restriction on private or public
 * 
 * will handle folder only input though is not as clearly defined as user-folder
 */
router.post("/user-files", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: "User not logged in" });
        }
        let file;
        if (req.body){
            console.log(req.body);
            file = await File.find({
                ...req.body,
                authorId: req.session.userId
            })
        } else{
            file = await File.find({authorId: req.session.userId});
        }
        if (file.length === 0){
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No file found!"});
        }
        return res
        .status(StatusCodes.SUCCESS)
        .json(file);

    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error, file fetch failed" });
    }
    return res.json(file);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/** 
 * get files liked by user
 * populates the array so that we can see the file names and ids 
 * no input necessary 
*/
router.get("/user-liked/all", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ error: "User not logged in" });
        }

        const liked = await User.findById(req.session.userId, 'likedFiles').populate('likedFiles');
        if (liked.length === 0){
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No file found!"});
        }
        return res
        .status(StatusCodes.SUCCESS)
        .json(liked);

    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error, liked files fetch failed" });
    }
    return res.json(liked);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/**
 * get other user folder
 * input types:
 * -- either authorId or author username/email
 * -- folder name
 * -- if no folder name = folder = Main
 * 
 * restricted to public files only
 */
router.post("/other-folder", async (req, res) =>{
    try{
        const {authorName, authorEmail, folder } = req.body;
        let {authorId} = req.body;
        const finalFolder = folder || "Main";
        if (!req.body){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"No author provided"});
        }
        if ((authorName || authorEmail) && !authorId){
            authorId = await User.findOne({$or:[{username: authorName}, {email: authorEmail}]},{select: '_id'});
        }
        const currentFolder = await File.find({authorId: authorId, folder: finalFolder, public:true});
    
        if (currentFolder.length === 0) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({error: "Public folder - files not found!"});
        }

        return res
        .status(StatusCodes.SUCCESS)
        .json(currentFolder);
        
    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error, folder fetch failed" });
    } 
});

/**
 * return the files of another user 
 * restricted to public files only
 * 
 * inputs needed:
 * -- author username, email, or _id --> need some unique identifier to find the user (name alone will not work)
 * -- fileName  
 * -- folder (optional)
 * -- file _id
 * 
 * output types (assuming user found):
 * -- fileName + folder or _id = return file if found
 * -- fileName alone = return list of files with that name
 * -- only author details = return list of all public files of a user
 * 
 * will not handle folder with no file name since that is other-folder
 *  
*/
router.post("/other-files", async (req, res) =>{
    try {
        const {authorName, authorEmail, fileName, folder, _id} = req.body;
        // check if the user provided exists
        let {authorId} = req.body;
        if (!req.body){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"No author provided"});
        } 
        if ((authorName || authorEmail) && !authorId){
            authorId = await User.findOne({$or:[{username: authorName}, {email: authorEmail}]},{select: '_id'});
        }

        // find file
        let file;
        if (_id){
            file = await File.findOne({_id:_id, public:true});

        } else if (fileName && folder){
            file = await File.findOne({
                authorId: authorId,
                public: true,
                folder: folder,
                fileName: fileName
            });
        } else if (fileName && !folder){
            file = await File.find({
                authorId: authorId,
                fileName: fileName,
                public: true
            });
        } else if (!fileName && !folder){
            file = await File.find({
                authorId: authorId,
                public: true
            });
        }

        if (file.length === 0){
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "No file found!"});
        }
        return res
        .status(StatusCodes.SUCCESS)
        .json(file);

    } catch (error) {
        console.error(error);
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error, file fetch failed" });
    }
});

/**
 * create a new file 
 * requires:
 * -- need to have unique filename for the same folder 
 * -- need to have unique folder for the same authorId 
 * 
 * will fetch username from session 
 * defaults to public and "Main" folder unless changed
 * text and description will be blank unless input is provided
 * comments will be empty
 *  
 */
router.post("/create", async(req, res) => {
    if (!req.session.userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "User not logged in" });
    }
    const {fileName, public, folder, text, description} = req.body;
    if (!fileName) {
        return res
          .status(StatusCodes.CREATION_FAILED)
          .json("Missing Required Field!");
    }
    try{
        const user = await User.findById(req.session.userId);
        const newFile = new File({
            fileName: fileName,
            public: public,
            folder: folder,
            text: text,
            description: description,
            dateCreated: new Date(),
            lastModified: new Date(),
            authorId: user._id,
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
    }
    // If encryption fails
    return res
      .status(StatusCodes.FILE_CREATION_FAILED)
      .json({ error: "File creation failed due to internal server error." });
  }
});

/**
 * create a comment on a file and update anything that is needed
 * should have file Id on hand to create comment 
 * input: 
 * -- file _id
 * -- comment content defaults to empty
 * 
 * will retrieve user id from session
 * 
 */
router.post("/comment/create", async (req, res) => {
    if (!req.session.userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "User not logged in" });
    }
    const {content} = req.body;
    if (!req.body._id){
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Missing file Id!"});
    }
    try{
        const user = await User.findById( req.session.userId);
        const file = await File.findById(req.body._id);
        if (!file){
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({error:"File not found!"});
        }
        const newComment = new Comment({
            file: file._id,
            authorId: user._id,
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

/**
 * get all comments associated with a file
 * search by file Id only since file should be at hand
 * then get the comments
 * This function populates the comment information so that 
 * front end does not need to fetch author name when displaying comment
*/
router.post("/comment/all", async (req, res) => {
    try {
        if (!req.body._id){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error:"Missing file Id!"});
        }
        const file = await File.findById(req.body._id).populate({path: 'comments',
            populate:[
            { path: 'authorId', model: 'User', select: 'name username' }, 
            { path: 'file', model: 'File', select: 'fileName'}
            ]});
        if (!file) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "File not found!" });
        } 
        if (file.comments.length === 0){
            return res 
            .status(StatusCodes.NOT_FOUND)
            .json({status: "No comments found!"})
        }
        return res.json(file.comments);
    } catch (error) {
        console.error(error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: "Internal Server Error, comments fetch failed!" });
    }
});


module.exports = router;
