const mongoose = require("mongoose");
const User = require("./User");
const Comment = require("./Comment");

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
  fileName: { type: String, required: true},
  public: { type: Boolean, required: true },
  dateCreated: { type: Date, required: true },
  lastModified: { type: Date, required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  comments: [{type: mongoose.Schema.Types.ObjectId,ref: 'Comment'}],
  folder: { type: String },
  ownerName: { type: String },
});

// Create a compound index to ensure fileName is unique per user
FileSchema.index({ fileName: 1, lastModifiedBy: 1 }, { unique: true });

module.exports = mongoose.model("File", FileSchema);
