const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Community:
 *       type: object
 *       required:
 *         - users
 */

// comment system, mdo file, folder
const CommunitySchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ], //array
});

module.exports = mongoose.model("Community", CommunitySchema);
