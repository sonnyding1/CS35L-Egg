const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  name: {type:String, required:true},
});


const User = mongoose.model('User', UserSchema);
module.exports = User;