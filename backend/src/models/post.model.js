const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // 👈 Match capital model name
    required: true
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
}, { timestamps: true });
module.exports = mongoose.model("Post", PostSchema);
