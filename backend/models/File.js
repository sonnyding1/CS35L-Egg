const mongoose = require("mongoose");
const User = require("./User");

/**
 * @swagger
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - fileName
 *         - ownerName
 *         - public/private
 *         - dateCreated
 *         - lastModified
 *         - lastModifiedBy
 *         - folder
 */

// comment system, mdo file, folder
const FileSchema = new mongoose.Schema({
  fileName: String,
  public: Boolean,
  dateCreated: Date,
  lastModified: Date,
  lastModifiedBy: User,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  folder: String,
  ownerName: String,
});

module.exports = mongoose.model("File", FileSchema);
