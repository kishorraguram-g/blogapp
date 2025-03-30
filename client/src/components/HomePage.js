import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaEnvelope } from "react-icons/fa"; 
import Header from "../Header.js";
import "./HomePage.css"; 

const HomePage = ({ username }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:4000/allposts");
        if (response.ok) {
          const data = await response.json();
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

  // Handle Like click
  const handleLike = async (postId, title, content, username) => {
    try {
      const response = await fetch("https://blogapp-server-mocha.vercel.app/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          title,
          content,
          likes: 1,
        }),
      });

      if (response.ok) {
        console.log("Like updated successfully!");
        const updatedPosts = posts.map((post) =>
          post._id === postId ? { ...post, likes: post.likes + 1 } : post
        );
        setPosts(updatedPosts);
      } else {
        console.error("Failed to update like");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Handle sending email
  const handleSendEmail = (post) => {
    // Construct the mailto link
    const subject = encodeURIComponent(`New Post: ${post.title}`);
    const body = encodeURIComponent(` I need to get some more info from you ! \nPost Title: ${post.title}\n\n${post.content} \n\nBy: ${post.username}\n `);
    const mailtoLink = `mailto:maheshwarann457@gmail.com?subject=${subject}&body=${body}`;
  
    // Open the mailto link
    window.location.href = mailtoLink;
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
                  <span>By: {post.username}</span>
                  <span>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                {/* Like and Mail Icons */}
                <div className="post-actions">
                  <div
                    className="post-like"
                    onClick={() => handleLike(post._id, post.title, post.content, username)}
                  >
                    <FaThumbsUp size={30} />
                    <span>Like</span>
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
