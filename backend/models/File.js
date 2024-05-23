const mongoose = require("mongoose");
const User = require("./User");
const Comment = require("./Comment");

/**
 * restructured the file system
 * files till now are just shells without being able to actually upload files
 * gridfs or multer will be used to upload files to the db and have their ID as a field of the file as a reference
 * preliminary features and working system is the following:
 *  - imagine a collection of files all in one place.
 *  - each file has an immutable owner which is the creator
 *      - this will be how we search for files using the session saved info
 *  - file names are unique to the folder that they are in 
 *  - folder names are unique to the owner names
 *  - this way we can properly identify which file belongs to which folder to which user
 *  - if you refer to the user model:
 *      - there is a files array that saves the ID of the files that belong to the user 
 *      - yes there is some redundancy there, which I can later remove is the first system works properly
 *      - there is also a liked files array which saves the ID of the files "liked" by the user
 *      - when expanding the community model, we will add another contributer field to the file to allow accessing, commenting
 *  -  I have added a bunch of getter functions for now for the files
 *  - have not tested all the get functions
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
  fileName: { type: String, required: true, unique: false},
  folder: { type: String, default: "main", unique: false},
  ownerName: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, immutable: true, unique: false},
  public: { type: Boolean, required: true, default: true },
  dateCreated: { type: Date, required: true, immutable: true },
  lastModified: { type: Date, required: true },
  lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  description:{ type:String, default:""},
  text: {type: String, default: ""},
  comments: [{type: mongoose.Schema.Types.ObjectId,ref: 'Comment'}],
});

// Ensure combination of owner, folder, and filename are unique
FileSchema.index({ fileName: 1, folder: 1, ownerName: 1 }, { unique: true });

module.exports = mongoose.model("File", FileSchema);
