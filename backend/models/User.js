const mongoose = require("mongoose");
const File = require("./File");

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
 *         - email
 *         - password
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
 *         email:
 *           type: string
 *           description: The user's unique email.
 *       example:
 *         username: johndoe
 *         password: password123
 *         name: John Doe
 *         email: johndoe@example.com
 */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, require: true },
  username: { type: String, unique: true },
  password: { type: String, required: true },
  files: [{type:mongoose.Schema.Types.ObjectId, ref:"File"}],
  likedFiles: [{type: mongoose.Schema.Types.ObjectId, ref:"File"}]
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
