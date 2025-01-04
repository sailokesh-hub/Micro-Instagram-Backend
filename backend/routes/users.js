const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
});

// Get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
});

// Get all posts by a specific user
router.get("/users/:userId/posts", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.findAll({
      where: { user_id: user.id },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving posts", error });
  }
});

// Create a new post for a user
router.post("/users/:userId/posts", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.create({
      ...req.body,
      user_id: user.id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Error creating post", error });
  }
});

// Edit a post for a user
router.put("/users/:userId/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
        user_id: req.params.userId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedPost = await post.update(req.body);
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: "Error updating post", error });
  }
});

// Delete a post for a user
router.delete("/users/:userId/posts/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.postId,
        user_id: req.params.userId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error deleting post", error });
  }
});

router.get('/', (req, res) => {
  res.status(200).send("Server running")
})

module.exports = router;
