const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {type:String, unique:true, required:true},
  password: {type:String, required:true},
  name: {type:String, required:true},
});


UserSchema.statics.login = async function(userData){
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser && await bcrypt.compare(userData.password, existingUser.password)) {
    return existingUser;
  }
  else if (existingUser){return "error 402";}
  return "error 401";
}

UserSchema.statics.signup = async function(userData){
  const hashedPassword = await bcrypt.hash(userData.password,10, (err)=>{
    if (err){
      return "error 404";
    }
  });
  try{
    const newUser = new User({ ...userData, password: hashedPassword});
    await newUser.save();
    return newUser;
  }catch(error){
    return "error 403";
  }
}

const User = mongoose.model('User', UserSchema);
module.exports = User;