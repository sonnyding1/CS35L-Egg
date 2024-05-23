const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const Comment = require("../models/Comment");
const StatusCodes = require("./statusCodes");
const router = express.Router();

/**
 * @swagger
 * /user/delete:
 *   post:
 *     tags: [User]
 *     summary: Delete a user
 *     description: Delete a user by username and password, will be adjusting to be more restrictive, but for now this is for testing purposes
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/user", async (req, res) => {
    const user = await User.findOneAndDelete(req.body);
    if (user == null) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found!" });
    }
    return res.json(user);
});
  

// delete one file from database
// to work needs two fields plus user session
// the fields are the file name and folder
router.post("/one-file", async (req, res) => {
    const {fileName, folder} = req.body;
    const user = await User.findOne({username:req.session.username});
    try {
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
    } catch (error){
        console.log(error);
        return res
        .status(StatusCodes.CREATION_FAILED)
        .json({ error: "File creation failed due to internal server error." });
    }
});


// delete oldest comment, the input should be filename and folder
// this can be avoided by having info in session too
router.post("/one-comment", async (req, res) => {
    const {fileName, folder} = req.body;
    if (!fileName || !folder){
        return res
        .status(StatusCodes.BAD_REQUEST)
        .json({error: "Insufficient information to delete comment!"});
    }
    try{
        const user = await User.findOne({username:req.session.username});
        const file = await File.findOne({ownerName: user._id, fileName: fileName, folder: folder});
        const comment = await Comment.findOneAndDelete({
            file: file._id,
            author: user._id
        });
        if (comment  == null) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Comment not found!" });
        }
        await file.comments.pull(comment._id);
        await file.save();
        await user.save();
        return res.json(comment);
    } catch (error){
        console.log(error);
        return res
          .status(StatusCodes.CREATION_FAILED)
          .json({ error: "Comment creation failed due to internal server error." });
    }
});

module.exports = router;
