const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

// POST route to create a new user
router.post("/users", async (req, res) => {
  try {
    const { name, mobile_number, address } = req.body;

    // Validate input
    if (!name || !mobile_number || !address) {
      return res.status(400).json({
        message: "All fields are required: name, mobile_number, and address.",
      });
    }

    const existingUser = await User.findOne({ where: { mobile_number: req.body.mobile_number } });
    if (existingUser) {
      return res.status(409).json({ message: "Mobile number already in use." });
    }

    // Create a new user
    const user = await User.create({
      name,
      mobile_number,
      address,
    });

    res.status(201).json({ message: "User created successfully", user });
    
  } catch (error) {
    // Handle unique constraint error for mobile_number
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Mobile number must be unique.",
        error: error.errors,
      });
    }

    res.status(500).json({ message: "Error creating user", error });
  }
});


// POST route to create a post for a user
router.post("/users/:userId/posts", async (req, res) => {
  try {
    const { title, description, images } = req.body;
    
    // Ensure title and description are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    // Find the user
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User with the given user_id does not exist." });
    }

    // Create the post
    const post = await Post.create({
      title,
      description,
      images: images || [], // Ensure images is always an array
      user_id: user.id,
    });

    // Increment the post count for the user
    await user.increment("post_count");

    // Respond with the post details
    res.status(201).json({
      message: "Post created successfully",
      post, // Return the created post object
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while creating the post.", error });
  }
});





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
    res.status(400).json({ message: "Error updating post" });
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

router.get("/", (req, res) => {
  res.status(200).send("Server running");
});

module.exports = router;
