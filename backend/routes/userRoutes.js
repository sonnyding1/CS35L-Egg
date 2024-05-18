const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

const StatusCodes = {
  SUCCESS: 200,
  USER_NOT_FOUND: 401,
  WRONG_PASSWORD: 402,
  USERNAME_TAKEN: 403,
  PASSWORD_FAULT: 404,
};

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
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/users", async (req, res) => {
  res.json(await User.find({}).exec());
});

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Search for a user by username or name
 *     description: Search for a user by username or name.
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/", async (req, res) => {
  res.json(
    await User.find({
      $or: [{ name: req.body.name }, { username: req.body.username }],
    }).exec()
  );
});

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags: [User]
 *     summary: Login a user
 *     description: Login a user by username and password.
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       402:
 *         description: Wrong password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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
router.post("/login", async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (
    existingUser &&
    (await bcrypt.compare(req.body.password, existingUser.password))
  ) {
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
 *     description: Signup a new user by username, name and password.
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
 *               password:
 *                 type: string
 *                 description: The user's password.
 *           examples:
 *             user:
 *               value:
 *                 username: "testuser"
 *                 name: "Test User"
 *                 password: "testpassword"
 *               summary: A simple example
 *     responses:
 *       200:
 *         description: A user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Username taken.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
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
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    return res.json(newUser);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // 11000 is the error code for duplicate key in MongoDB
      return res
        .status(StatusCodes.USERNAME_TAKEN)
        .json({ error: "Username Taken!" });
    }
    // For other errors, return a generic error response
    return res
      .status(StatusCodes.PASSWORD_FAULT)
      .json({ error: "Password Fault, Encryption Failed!" });
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
