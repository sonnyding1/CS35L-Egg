const mongoose = require("mongoose");
const File = require("./File");

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
  file: File,
  content: String
});

module.exports = mongoose.model("Comment", CommentSchema);
