const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentSchema:
 *       type: object
 *       required:
 *         - file
 *         - content
 */

const CommentSchema = new mongoose.Schema({
  file: {type: mongoose.Schema.Types.ObjectId, ref:'File', required: true, immutable: true},
  authorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true},
  dateCreated: {type: Date, required: true, immutable: true},
  lastModified: {type: Date, required:true},
  content: {type: String, default: ''}
});

CommentSchema.index({dateCreated:1});
module.exports = mongoose.model("Comment", CommentSchema);