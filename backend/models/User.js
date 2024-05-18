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
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  name: {type:String, required:true},
});


const User = mongoose.model('User', UserSchema);
module.exports = User;