const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

const StatusCodes = {
  SUCCESS: 200,
  USER_NOT_FOUND: 404,
  WRONG_PASSWORD: 409,
  USERNAME_TAKEN: 409,
  EMAIL_TAKEN: 409,
  USER_CREATION_FAILED: 500,
  INTERNAL_ERROR: 500,
};
/**
 * DISCLAIMER:
 * THE FILE SYSTEM HAS NOT BEEN SET UP FULLY YET 
 * SO THE FILES ARE SIMPLY STRING NAMES FOR NOW 
 * I HAVE AN IDEA OF HOW TO UPLOAD FILES
 * BUT HAVE NOT YET WORKED ON IT
 * 
 * THE WAY I HAVE IMPLEMENTED THE GET SO FAR IS TO FIND THE USER
 * THEN FIND THE FILE/S, NOT SURE ABOUT THE SESSION TOPIC 
 */


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
 * @swagger
 * /user/users:
 *   get:
 *     tags: [User]
 *     summary: Retrieve a list of all users
 *     description: Retrieve a list of all users from the database. This endpoint is intended for administrative use and should be protected to prevent unauthorized access.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) {
      return res
        .status(StatusCodes.USER_NOT_FOUND)
        .json({ error: "User not found!" });
    }
    return res.json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Retrieve the current logged in user
 *     description: Retrieve the current logged in user from the session. This endpoint is intended for retrieving user information based on the session and should be protected to prevent unauthorized access. **Try it out does not work on this, because Swagger doesn't allow testing with sessions.**
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/", async (req, res) => {
  try {
    const user = await User.find({
      username: req.session.username,
    }).exec();
    if (user.length === 0) {
      return res
        .status(StatusCodes.USER_NOT_FOUND)
        .json({ error: "User not found!" });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_ERROR)
      .json({ error: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [User]
 *     summary: Login a user
 *     description: Login a user by username and password.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *           examples:
 *             user:
 *               value:
 *                 username: "testuser"
 *                 password: "testpassword"
 *               summary: A simple example
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Wrong password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
  });
  if (
    existingUser &&
    (await bcrypt.compare(req.body.password, existingUser.password))
  ) {
    req.session.username = existingUser.username;
    return res.json(existingUser);
  } else if (existingUser) {
    return res
      .status(StatusCodes.WRONG_PASSWORD)
      .json({ error: "Wrong Password!" });
  }
  return res
    .status(StatusCodes.USER_NOT_FOUND)
    .json({ error: "User not found!" });
});

/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags: [User]
 *     summary: Signup a new user
 *     description: Signup a new user by username, name, email and password.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               name:
 *                 type: string
 *                 description: The user's name.
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *           examples:
 *             user:
 *               value:
 *                 username: "testuser"
 *                 name: "Test User"
 *                 email: "testuser@example.com"
 *                 password: "testpassword"
 *               summary: A simple example
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Username taken.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Password fault, encryption failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password | !username) {
    return res
      .status(StatusCodes.USER_CREATION_FAILED)
      .json("Missing Required Field!");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultUsername = email.split("@")[0];
    const finalUsername = username || defaultUsername;
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      username: finalUsername,
    });
    await newUser.save();
    req.session.username = newUser.username;
    return res.json(newUser);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // 11000 is the error code for duplicate key in MongoDB
      const field = Object.keys(error.keyPattern)[0];
      if (field === "email") {
        return res
          .status(StatusCodes.EMAIL_TAKEN)
          .json({ error: "Email already exists!" });
      } else if (field === "username") {
        return res
          .status(StatusCodes.USERNAME_TAKEN)
          .json({ error: "Username already exists!" });
      }
    }
    // If encryption fails
    return res
      .status(StatusCodes.USER_CREATION_FAILED)
      .json({ error: "User creation failed due to internal server error." });
  }
});


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
router.post("/delete", async (req, res) => {
  const user = await User.findOneAndDelete(req.body);
  if (user == null) {
    return res
      .status(StatusCodes.USER_NOT_FOUND)
      .json({ error: "User not found!" });
  }
  return res.json(user);
});

module.exports = router;
