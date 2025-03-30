import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaThumbsUp } from "react-icons/fa"; 
import "./Mypost.css";
import Header from "../Header";

const Mypost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [previousTitle, setPreviousTitle] = useState("");
  const [previousContent, setPreviousContent] = useState("");

  useEffect(() => {
    console.log("Fetching posts for profilename:", username);

    const fetchData = async () => {
      try {
        // Fetch posts (each post includes its likes count)
        const postsResponse = await fetch(`http://localhost:4000/posts/${username}`);
        const postsData = postsResponse.ok ? await postsResponse.json() : null;
        console.log("Posts data -->", postsData);
        if (postsData) setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (username) {
      fetchData();
    }
  }, [username]);

  // Handle edit click
  const handleEdit = (post) => {
    console.log("Edit Clicked:");
    console.log("Previous Title:", post.title);
    console.log("Previous Content:", post.content);
    setEditingPost(post._id);
    setUpdatedTitle(post.title);
    setUpdatedContent(post.content);
    setPreviousTitle(post.title);
    setPreviousContent(post.content);
  };

  const handleDelete = async (post) => {
    console.log("Deleting Post:", post);
    const postToDelete = {
      username: post.username,
      title: post.title,
      content: post.content,
    };
  
    try {
      const response = await fetch("http://localhost:4000/deletepost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postToDelete),
      });
  
      if (response.ok) {
        console.log("Post deleted successfully");
        setPosts((prevPosts) =>
          prevPosts.filter((p) => p._id !== post._id)
        );
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  // Handle save and send update to backend
  const handleSave = async () => {
    console.log("Previous Title:", previousTitle);
    console.log("Current Title:", updatedTitle);
    console.log("Previous Content:", previousContent);
    console.log("Current Content:", updatedContent);
    console.log("Username:", username);

    const updatedPost = {
      username,
      previousTitle,
      currentTitle: updatedTitle,
      previousContent,
      currentContent: updatedContent,
    };

    try {
      const response = await fetch("http://localhost:4000/updatepost", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        console.log("Post updated successfully");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === editingPost ? { ...post, title: updatedTitle, content: updatedContent } : post
          )
        );
      } else {
        console.error("Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }

    setEditingPost(null);
  };

  // Handle Like button click
  const handleLike = async (post) => {
    try {
      const response = await fetch("https://blogapp-smoky-sigma.vercel.app/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send title, username, content, and likes increment in the request body
        body: JSON.stringify({ username, title: post.title, content: post.content, likes: 1 }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Like updated successfully!");
        // Update the specific post's likes count in state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id ? { ...p, likes: data.updatedPost.likes } : p
          )
        );
      } else {
        console.error("Failed to update like:", data.error);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="myposts-container">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post">
              {editingPost === post._id ? (
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="edit-title"
                />
              ) : (
                <h2>{post.title}</h2>
              )}
              {editingPost === post._id ? (
                <textarea
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  className="edit-textarea"
                />
              ) : (
                <p>{post.content}</p>
              )}
              {/* Display like count directly from the post object */}
              <p>
                <FaThumbsUp size={30} onClick={() => handleLike(post)} style={{ cursor: "pointer" }} /> {post.likes || 0}
              </p>
              <small>Created at: {new Date(post.createdAt).toLocaleString()}</small>
              <div className="post-actions">
                {editingPost === post._id ? (
                  <button className="save-btn" onClick={handleSave}>Save</button>
                ) : (
                  <FaEdit className="edit-icon" onClick={() => handleEdit(post)} />
                )}                
                <FaTrash className="delete-icon" onClick={() => handleDelete(post)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mypost;
