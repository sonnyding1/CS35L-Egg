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

// comment system, mdo file, folder
const CommentSchema = new mongoose.Schema({
  file: {type: mongoose.Schema.Types.ObjectId, ref:'File', required: true, immutable: true},
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true},
  dateCreated: {type: Date, immutable: true},
  content: {type: String, default: ''}
});

CommentSchema.index({dateCreated:1});
module.exports = mongoose.model("Comment", CommentSchema);
