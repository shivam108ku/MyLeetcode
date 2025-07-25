const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

// ✅ Create Post
const post = async (req, res) => {
  const { content, userId } = req.body;
  try {
    const newPost = new Post({ content, author: req.userId });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: "Post creation failed", error: err });
  }cd
};

// ✅ Get All Posts with comment count
const getAllPost = async (req, res) => {
  try {
    let posts = await Post.find()
      .populate("author", "firstName")
      .sort({ createdAt: -1 })
      .lean();

    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    posts = posts.map((post) => ({
      ...post,
      commentCount: countMap[post._id.toString()] || 0
    }));

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to fetch posts", error: err });
  }
};

// ✅ Like/Unlike Post
const likeUnlike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      totalLikes: post.likes.length,
    });
  } catch (err) {
    console.error("Like toggle error:", err);
    res.status(500).json({
      message: "Failed to toggle like",
      error: err.message || err.toString(),
    });
  }
};

// ✅ Add Comment
const addComment = async (req, res) => {
  const { content, userId } = req.body;
  try {
    const comment = new Comment({
      content,
      author: req.result._id,
      post: req.params.id,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: "Failed to add comment", error: err });
  }
};

// ✅ Get Comments for a Post
const getComment = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate("author", "firstName")
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments", error: err });
  }
};

module.exports = {
  post,
  getAllPost,
  likeUnlike,
  addComment,
  getComment,
};
