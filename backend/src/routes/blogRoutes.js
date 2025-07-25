const express = require('express');
const blogRouter = express.Router();
const {createBlog , deleteBlog , updateBlog , fetchBlog } = require('../controllers/createBlog')
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware')

blogRouter.post('/create',adminMiddleware,createBlog);
 
blogRouter.delete('/:id', adminMiddleware, deleteBlog);
blogRouter.patch('/:id', adminMiddleware , updateBlog);
blogRouter.get('/', userMiddleware , fetchBlog);
 

module.exports = blogRouter;