const mongoose = require("mongoose");

/**
 * components:
 *   schemas:
 *     File:
 *       type: object
 *       required:
 *         - fileName
 *         - authorId
 *         - public/private
 *         - dateCreated
 *         - lastModified
 *         - lastModifiedBy
 *         - folder
 *         - authorId
 */

// comment system, mdo file, folder
const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true, unique: false },
  folder: { type: String, default: "Main", unique: false },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
    unique: false,
  },
  public: { type: Boolean, required: true, default: true },
  dateCreated: { type: Date, required: true, immutable: true },
  lastModified: { type: Date, required: true },
  text: { type: String, default: "" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likeCount: { type: Number, default: 0 },
});

// Ensure combination of authorId, folder, and filename are unique
FileSchema.index({ fileName: 1, folder: 1, authorId: 1 }, { unique: true });
FileSchema.index({ folder: 1 });
FileSchema.index({ dateCreated: 1 });
FileSchema.index({ lastModified: 1 });

module.exports = mongoose.model("File", FileSchema);
