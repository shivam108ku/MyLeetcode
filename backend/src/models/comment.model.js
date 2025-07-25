const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // ✅ model name should be 'user' or match your User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);
