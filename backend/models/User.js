const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The user's name.
 *         email:
 *           type: string
 *           description: The user's email.
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 */
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("User", UserSchema);
