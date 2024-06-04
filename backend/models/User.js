const mongoose = require("mongoose");

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
