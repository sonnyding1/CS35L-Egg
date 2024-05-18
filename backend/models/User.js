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
 *         - password
 *       properties:
 *          name:
 *            type: string
 *            description: The user's name.
 *          email:
 *            type: string
 *            description: The user's email.
 *          username: 
 *            type: string
 *            description: The user's username, default is the email
 *          password:
 *            type: string
 *            description: The user's hashed password
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         username: john.doe
 *         password: ...
 */
const UserSchema = new mongoose.Schema({
  name: {type:String, required:true},
  email: {type:String, unique:true, require:true},
  username: {type:String, unique:true},
  password: {type:String, required:true},
});


const User = mongoose.model('User', UserSchema);
module.exports = User;