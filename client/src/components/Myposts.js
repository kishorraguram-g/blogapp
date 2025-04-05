import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaThumbsUp } from "react-icons/fa";
import "./Mypost.css";
import Header from "../Header";

const Mypost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${username}`);
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
        setError(err.message);
      }
    };
    if (username) fetchData();
  }, [username]);

  const handleEdit = (post) => {
    // Log the username, title, and content for debugging
    console.log("Editing Post - Username:", post.username, "Title:", post.title, "Content:", post.content);
    
    setEditingPost(post._id);
    setUpdatedTitle(post.title);
    setUpdatedContent(post.content);
  };

  const handleDelete = async (post) => {
    // Log the username, title, and content for debugging
    console.log("Deleting Post - Username:", post.username, "Title:", post.title, "Content:", post.content);
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deletepost?username=${encodeURIComponent(post.username)}&title=${encodeURIComponent(post.title)}&content=${encodeURIComponent(post.content)}`,
        {
          method: "DELETE", // Correct HTTP method
          headers: { "Content-Type": "application/json" }
        }
      );
  
      const data = await response.json();
      console.log("Delete Response:", data);
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }
  
      // After successful deletion, filter the posts to remove the deleted post
      setPosts(posts.filter((p) => p._id !== post._id));
  
      alert("✅ Post deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      alert("❌ Failed to delete post");
    }
  };
  

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/updatepost`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username, // Add the username field
          previousTitle: posts.find(post => post._id === editingPost)?.title, // Get the previous title
          currentTitle: updatedTitle,
          previousContent: posts.find(post => post._id === editingPost)?.content, // Get the previous content
          currentContent: updatedContent,
        }),
      });
      if (!response.ok) throw new Error("Failed to update post");
      setPosts(posts.map((post) => (post._id === editingPost ? { ...post, title: updatedTitle, content: updatedContent } : post)));
      setEditingPost(null);
    } catch (err) {
      console.error("Error updating post:", err.message);
      setError(err.message);
    }
  };

  const handleLike = async (post) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: post._id, likes: post.likes + 1 }),
      });
      if (!response.ok) throw new Error("Failed to like post");
      setPosts(posts.map((p) => (p._id === post._id ? { ...p, likes: p.likes + 1 } : p)));
    } catch (err) {
      console.error("Error liking post:", err.message);
      setError(err.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="myposts-container">
        {error && <p className="error">{error}</p>}
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post">
              {editingPost === post._id ? (
                <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
              ) : (
                <h2>{post.title}</h2>
              )}
              {editingPost === post._id ? (
                <textarea value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)} />
              ) : (
                <p>{post.content}</p>
              )}
              <p>
                <FaThumbsUp size={30} onClick={() => handleLike(post)} style={{ cursor: "pointer" }} /> {post.likes || 0}
              </p>
              <small>Created at: {new Date(post.createdAt).toLocaleString()}</small>
              <div className="post-actions">
                {editingPost === post._id ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <FaEdit onClick={() => handleEdit(post)} />
                )}
                <FaTrash onClick={() => handleDelete(post)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Mypost;
