import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaEnvelope } from "react-icons/fa";
import Header from "../Header.js";
import "./HomePage.css";

const HomePage = ({ username }) => {
  console.log(process.env.REACT_APP_API_URL)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ✅ Ensure API_URL is correctly set
   
    if (!process.env.REACT_APP_API_URL) {
      console.error("API_URL is not defined!");
      console.log(process.env.REACT_APP_API_URL)
      return;
    }

    console.log("API URL:",process.env.REACT_APP_API_URL); // Debugging API URL

    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allposts`);
        console.log(response);
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data); // Debugging fetched data
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAllPosts();
  }, []);

  // ✅ Handle Like click
  const handleLike = async (postId, title, content, username) => {
   
    try {
      // Optimistic UI Update
      const updatedPosts = posts.map((post) =>
        post._id === postId ? { ...post, likes: post.likes + 1 } : post
      );
      setPosts(updatedPosts);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, title, content, likes: 1 }),
      });

      if (!response.ok) {
        console.error("Failed to update like");
        setPosts(posts); // Revert UI update if request fails
      } else {
        console.log("Like updated successfully!");
      }
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts(posts); // Revert UI update if request fails
    }
  };

  // ✅ Handle sending email
  const handleSendEmail = (post) => {
    const subject = encodeURIComponent(`New Post: ${post.title}`);
    const body = encodeURIComponent(
      `I need to get some more info from you!\n\nPost Title: ${post.title}\n\n${post.content}\n\nBy: ${post.username}\n`
    );
    window.location.href = `mailto:maheshwarann457@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="homepage-container">
      <Header />
      <div className="content-wrapper">
        <h1 className="welcome-message">
          Welcome, <span>{username || "Guest"}!</span>
        </h1>
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="no-posts-message">No posts available.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                <div className="post-meta">
                  <span>By: {post.username || "Unknown"}</span>
                  <span>
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleString()
                      : "No date available"}
                  </span>
                </div>
                <div className="post-actions">
                  <div
                    className="post-like"
                    onClick={() =>
                      handleLike(post._id, post.title, post.content, username)
                    }
                  >
                    <FaThumbsUp size={30} />
                    <span>Like ({post.likes})</span>
                  </div>
                  <div
                    className="post-mail"
                    onClick={() => handleSendEmail(post)}
                    style={{ cursor: "pointer", marginLeft: "10px" }}
                  >
                    <FaEnvelope size={30} />
                    <span>Mail</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
