const express = require("express");
const router = express.Router();
const { post, getAllPost, likeUnlike, addComment, getComment } = require("../controllers/feedController");
const userMiddleware = require("../middleware/userMiddleware");

// Create a new post
router.post("/post" , userMiddleware, post);

// Get all posts
router.get("/", userMiddleware, getAllPost);

// Like/unlike a post
router.post("/:id/like", userMiddleware,likeUnlike);

// Add a comment
router.post("/:id/comment", userMiddleware,addComment);

// Get comments
router.get("/:id/comments", userMiddleware,getComment);

module.exports = router;
