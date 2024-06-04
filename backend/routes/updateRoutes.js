const express = require("express");
const User = require("../models/User");
const File = require("../models/File");
const Comment = require("../models/Comment");
const StatusCodes = require("./statusCodes");
const bcrypt = require("bcrypt");
const router = express.Router();

/**
 * update functions will be placed here
 * will have:
 * update user
 * update file
 * update comment
 */

/**
 * update user information like name, email, and username
 * user has to be logged in to update fields
 * input can be any of the following:
 * -- username
 * -- name
 * -- email
 *
 * can be all inputs at the same time
 * checks if the values exist in the database
 * returns an error if that is the case (ie non unique values)
 *
 * checks if an input is already the set case
 * (ie if no changes are made it will let you know)
 */
router.post("/user/info", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "User not logged in!" });
    }
    const user = await User.findById(req.session.userId);

    const { name, email, username } = req.body;
    const updateFields = {};

    if (name && name !== user.name) updateFields.name = name;
    if (email && email !== user.email) updateFields.email = email;
    if (username && username !== user.username)
      updateFields.username = username;

    if (Object.keys(updateFields).length > 0) {
      await User.updateOne({ _id: req.session.userId }, updateFields);
    } else {
      return res.status(StatusCodes.OK).json({ message: "Nothing to update!" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "User information updated successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // 11000 is the error code for duplicate key in MongoDB
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Email already exists!" });
      } else if (field === "username") {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "Username already exists!" });
      }
    }
    // If encryption fails
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, user update failed!" });
  }
});

/**
 * update user password
 * requires user to be logged in
 * inputs are the following:
 * -- oldPassword
 * -- newPassword
 *
 * evaluates oldPassword to check if its true
 * then changes the password if its true
 *
 * does not allow empty inputs
 * reports if newPassword == oldPassword
 */
router.post("/user/password", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "User not logged in!" });
    }
    const user = await User.findById(req.session.userId);

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Both old and new passwords are required!" });
    }

    if (oldPassword === newPassword) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Same password, nothing updated!" });
    }

    if (await bcrypt.compare(oldPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.updateOne({ _id: user._id }, { password: hashedPassword });
      return res
        .status(StatusCodes.OK)
        .json({ message: "User password updated successfully!" });
    } else {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Wrong password!" });
    }
  } catch (error) {
    console.log(error);
    // If encryption fails
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, user update failed!" });
  }
});

/**
 * update user file
 * needs file _id to modify the file
 * can handle the following inputs:
 * -- fileName
 * -- folder
 * -- public
 * -- text
 *
 * can handle all the above inputs at the same time
 *
 * will throw an error if you change the file name to a non unique folder/file combination
 * checks if an input is already the set case
 * (ie if no changes are made it will let you know)
 */
router.post("/user/file", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "User not logged in!" });
    }
   
    const { _id, fileName, folder, public, text } = req.body;
    const file = await File.findOne({ _id, authorId: req.session.userId });
    if (!file) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "File not found!" });
    }

    const updateFields = {};
    if (fileName && fileName !== file.fileName)
      updateFields.fileName = fileName;
    if (folder && folder !== file.folder) updateFields.folder = folder;
    if (typeof public === "boolean" && public !== file.public)
      updateFields.public = public;
    if (text && text !== file.text) updateFields.text = text;

    if (Object.keys(updateFields).length > 0) {
      updateFields.lastModified = new Date();
      await File.updateOne({ _id: file._id }, updateFields);
    } else {
      return res.status(StatusCodes.OK).json({ message: "Nothing to update!" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "File content updated successfully!" });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // 11000 is the error code for duplicate key in MongoDB
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: "File with this name already exists in this folder!" });
    }

    // If encryption fails
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, file update failed!" });
  }
});

/**
 * update user comment
 * needs comment _id to modify the comment
 * needs field "content" to update comment content
 *
 * checks if an input is already the set case
 * (ie if not changes are made it will let you know)
 */
router.post("/user/comment", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "User not logged in!" });
    }

    const { _id, content } = req.body;
    const comment = await Comment.findOne({
      _id,
      authorId: req.session.userId,
    });
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Comment not found!" });
    }

    if (content && content !== comment.content) {
      const updateFields = { content: content, lastModified: new Date() };
      await Comment.updateOne({ _id: comment._id }, updateFields);
    } else {
      return res.status(StatusCodes.OK).json({ message: "Nothing to update!" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Comment content updated successfully!" });
  } catch (error) {
    console.error(error);
    // If encryption fails
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, comment update failed!" });
  }
});

module.exports = router;
