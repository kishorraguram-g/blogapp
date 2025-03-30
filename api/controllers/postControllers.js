const Post = require("../models/PostModel");

// Create a new post
const createPost = async (req, res) => {
  console.log("🔹 Received post request:", req.body);

  const { userId, username, title, content } = req.body;

  if (!userId || !username || !title || !content) {
    return res.status(400).json({ error: "⚠️ All fields are required" });
  }

  try {
    const newPost = new Post({ userId, username, title, content, likes: 0 });
    await newPost.save();
    console.log("✅ Post created successfully:", newPost);
    res.status(201).json({ message: "✅ Post created successfully", post: newPost });
  } catch (error) {
    console.error("❌ Post creation error:", error);
    res.status(500).json({ error: "❌ Failed to create the post" });
  }
};

// Fetch all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "❌ Could not fetch posts" });
  }
};

const getUserPosts = async (req, res) => {
    const { username } = req.params; // Extract username from request params
    try {
      const posts = await Post.find({ username }).sort({ createdAt: -1 }); // Find by username
      res.status(200).json(posts);
    } catch (error) {
      console.error("❌  Internal Server Error", error);
      res.status(500).json({ error: "❌ Internal server error" });
    }
  };  
  const deletePost = async (req, res) => {
    try {
      const { username, title, content } = req.body; // Extract details from request body
  
      if (!username || !title || !content) {
        return res.status(400).json({ error: "⚠️ Missing required fields" });
      }
  
      // Find the post using username, title, and content
      const post = await Post.findOne({ username, title, content });
  
      if (!post) {
        return res.status(404).json({ error: "❌ Post not found" });
      }
  
      // Delete the post
      await Post.deleteOne({ _id: post._id });
  
      res.status(200).json({ message: "✅ Post deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      res.status(500).json({ error: "⚠️ Failed to delete post" });
    }
  };

  const updatePost = async (req, res) => {
    const { username, previousTitle, currentTitle, previousContent, currentContent } = req.body; // Extract post details

    try {
        const updatedPost = await Post.findOneAndUpdate(
            { username, title: previousTitle, content: previousContent }, // Find the specific post
            { title: currentTitle, content: currentContent }, // Update fields
            { new: true } // Return updated post
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "❌ Post not found" });
        }

        res.status(200).json({ message: "✅ Post updated successfully", updatedPost: updatedPost });

    } catch (error) {
        console.error("❌ Error updating post:", error);
        res.status(500).json({ error: "❌ Could not update post" });
    }
};

const likePost = async (req, res) => {
    const { title, username, content, likes } = req.body;  // 🔹 Now accepting title, username, and content

    try {
        // Find the post using title, username, and content
        const post = await Post.findOne({ title, username, content });

        if (!post) {
            return res.status(404).json({ error: "❌ Post not found" });
        }

        post.likes += likes; // ✅ Increment like count
        await post.save();

        res.status(200).json({ message: "✅ Post liked!", updatedPost: post });
    } catch (error) {
        console.error("❌ Error liking post:", error);
        res.status(500).json({ error: "❌ Could not like post" });
    }
};
const getLikesForUser = async (req, res) => {
    const { username } = req.body; // Receive username from request body
  
    try {
      // Find all posts created by the user
      const posts = await Post.find({ username });
  
      if (!posts.length) {
        return res.status(404).json({ error: "❌ No posts found for user" });
      }
  
      // Map each post to an object containing its title and like count
      const likeData = posts.map(post => ({
        title: post.title,
        like: post.likes // Assumes the Post model has a 'likes' field
      }));
  
      res.status(200).json({ data: likeData });
    } catch (error) {
      console.error("❌ Error fetching likes:", error);
      res.status(500).json({ error: "❌ Could not fetch likes" });
    }
  };

  
module.exports = { createPost, getAllPosts, getUserPosts, deletePost, updatePost, likePost, getLikesForUser };
