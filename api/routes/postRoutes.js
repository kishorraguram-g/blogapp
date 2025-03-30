const express = require("express");
const { createPost, getAllPosts, getUserPosts,deletePost ,updatePost ,likePost ,getLikesForUser  } = require("../controllers/postControllers");

const router = express.Router();

router.post("/post", createPost); // Create a new post
router.get("/allposts", getAllPosts); // Get all posts
router.get("/posts/:username", getUserPosts);
router.delete("/deletepost", deletePost);
router.put("/updatepost", updatePost); // Update a post
router.post("/like", likePost);
router.post("/fetch-likes", getLikesForUser);
module.exports = router;
