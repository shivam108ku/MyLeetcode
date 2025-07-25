const BlogSchema = require('../models/blog.model');

const createBlog = async (req, res) => {
    console.log("Request Body:", req.body);

    try {
        const blog = new BlogSchema({
            ...req.body,
            author: req.result._id
        });

        // Correct: Use .save() instead of .create()
        await blog.save(); // ← This is the key fix

        res.status(201).send("success");
    } catch (err) {
        console.error("Error creating blog:", err); // Better error logging
        res.status(400).send(err.message); // Send only the error message
    }
}

const updateBlog = async (req, res) => {
    try {
        await BlogSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(blog);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await BlogSchema.findByIdAndDelete(req.params.id);
        res.send({ message: 'Blog deleted sucessfully' });
    } catch (error) {
        res.status(500).send(error);
    }
}

const fetchBlog = async (req, res) => {
    try {
        const blogs = await BlogSchema.find({ isPublished: true }).populate('author');
        res.send(blogs);
    } catch (error) {
        res.status(500).send(error);
    }
}



module.exports = { createBlog, deleteBlog, updateBlog, fetchBlog }