const mongoose = require("mongoose");

/**
 * Restructured the file system
 * Preliminary features and working system is the following:
 *  - Imagine a collection of files all in one place.
 *  - Each file has an immutable owner which is the creator
 *      - This will be how we search for files using the session saved info
 *  - File names are unique to the folder that they are in
 *  - Folder names are unique to the owner names
 *  - This way we can properly identify which file belongs to which folder to which user
 *  - If you refer to the user model:
 *      - there is a files array that saves the ID of the files that belong to the user
 *      - yes there is some redundancy there, which I can later remove if the first system works properly
 *      - there is also a liked files array which saves the ID of the files "liked" by the user
 *      - when expanding the community model, we will add another contributer field to the file to allow accessing, commenting
 *  - I have added a bunch of getter functions for now for the files
 *  - Have not tested the get liked function
 */

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
 *         - ownerName
 */

// comment system, mdo file, folder
const FileSchema = new mongoose.Schema({
  fileName: { type: String, required: true, unique: false },
  folder: { type: String, default: "main", unique: false },
  ownerName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true,
    unique: false,
  },
  public: { type: Boolean, required: true, default: true },
  dateCreated: { type: Date, required: true, immutable: true },
  lastModified: { type: Date, required: true },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: String, default: "" },
  text: { type: String, default: "" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

// Ensure combination of owner, folder, and filename are unique
FileSchema.index({ fileName: 1, folder: 1, ownerName: 1 }, { unique: true });

module.exports = mongoose.model("File", FileSchema);
