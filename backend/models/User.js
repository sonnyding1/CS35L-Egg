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
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, required: true, immutable: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
  likedFiles: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
    validate: {
      validator: function (array) {
        return array.length === new Set(array.map(String)).size;
      },
      message: "likedFiles array contains duplicates",
    },
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
