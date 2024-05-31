const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const StatusCodes = require("./statusCodes");

const router = express.Router();

/*
Implementing user functionality 
*/

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * get all users from db, more for internal data than a user function.
 * gets all information with no restrictions.
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found!" });
    }
    return res.status(StatusCodes.SUCCESS).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error, could not get users!" });
  }
});

/**
 * get user --> retreives user information for logged in user
 *              or if given an input returns that users info
 *
 * types of inputs:
 * -- unique values = username or email or _id --> return that user if found
 * -- duplicate values = name --> return a list of users with that name
 * -- no input = logged in user --> return logged in user info
 */
router.post("/", async (req, res) => {
  try {
    let user;
    const { name, username, email, _id } = req.body;
    if (username || email || _id) {
      user = await User.findOne({
        $or: [{ username: username }, { email: email }, { _id: _id }],
      });
      req.session.otherUser = user._id;
    } else if (name && !username && !email) {
      user = await User.find({ name: name });
    } else if (req.session.userId && Object.keys(req.body).length === 0) {
      user = await User.findById(req.session.userId);
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Incorrect search field!" });
    }
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found!" });
    }
    return res.status(StatusCodes.SUCCESS).json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, could not get user!" });
  }
});

/**
 * user log in function
 * requires either email or username to log in with correct password
 *
 * returns user if true
 * returns wrong password if user exists
 * returns no user found if user not found
 *
 */
router.post("/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    });
    if (
      existingUser &&
      (await bcrypt.compare(req.body.password, existingUser.password))
    ) {
      req.session.userId = existingUser._id;
      return res.status(StatusCodes.SUCCESS).json(existingUser);
    } else if (existingUser) {
      return res
        .status(StatusCodes.WRONG_PASSWORD)
        .json({ error: "Wrong Password!" });
    }
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found!" });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, user log in failed!" });
  }
});

/**
 * user sign up function --> create a new user
 *
 * required inputs:
 * -- email
 * -- name
 * -- password
 * * username will be the email name if a username field is not supplied
 * * email and username need to be unique and are checked to be so
 *
 * other fields are not required but can be supplied and will be added if present
 */
router.post("/signup", async (req, res) => {
  const { email, password, name, username } = req.body;
  if (!email || !password || !name) {
    return res
      .status(StatusCodes.CREATION_FAILED)
      .json("Missing Required Field!");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultUsername = email.split("@")[0];
    const finalUsername = username || defaultUsername;
    const newUser = new User({
      dateCreated: new Date(),
      ...req.body,
      password: hashedPassword,
      username: finalUsername,
    });

    await newUser.save();
    req.session.userId = newUser._id;
    return res.status(StatusCodes.SUCCESS).json(newUser);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // 11000 is the error code for duplicate key in MongoDB
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res
          .status(StatusCodes.VALUE_TAKEN)
          .json({ error: "Email already exists!" });
      } else if (field === "username") {
        return res
          .status(StatusCodes.VALUE_TAKEN)
          .json({ error: "Username already exists!" });
      }
    }
    // If encryption fails
    return res
      .status(StatusCodes.CREATION_FAILED)
      .json({ error: "Internal server error, user creation failed!" });
  }
});

/**
 * user log out function
 * clears the cookies for current user and any folders/files they had open
 * and destroys the session
 */
router.get("/logout", async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Failed to destroy session:", err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to destroy session!" });
      }
      // clear the cookie as well
      res.clearCookie("connect.sid");
      return res
        .status(StatusCodes.SUCCESS)
        .json({ message: "User logged out successfully!" });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error, could not logout!" });
  }
});

module.exports = router;
