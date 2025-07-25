const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    tittle: { type: String, require: true },
    content: { type: String, require: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    tags: [String],
    isPublished: { type: Boolean, default: false }
})

module.exports = mongoose.model('Blog', BlogSchema);
