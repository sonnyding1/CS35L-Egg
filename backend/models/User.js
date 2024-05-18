const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - name
 *       properties:
 *         username:
 *           type: string
 *           description: The user's unique username.
 *         password:
 *           type: string
 *           description: The user's password.
 *         name:
 *           type: string
 *           description: The user's name.
 *       example:
 *         username: johndoe
 *         password: password123
 *         name: John Doe
 */
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
