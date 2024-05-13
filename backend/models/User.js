const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {type:String, required:true},
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
});

UserSchema.methods.checkSave = async function(userData) {
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    return existingUser;
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = new User({ ...userData, password: hashedPassword });
  await newUser.save();
  return newUser;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;