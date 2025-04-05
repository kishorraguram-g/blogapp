import React, { useState } from "react";
import "./CreatePosts.css";
import { useNavigate } from "react-router-dom";
import Header from "../Header";

const CreatePosts = ({ setPosts, profilename, userId }) => {
  console.log("Received props:", { profilename, userId });
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dynamically select API URL
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postDetails = {
      userId,
      username: profilename,
      title,
      content,
    };

    console.log("Sending post request with:", postDetails); // Debugging log

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postDetails),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Unknown error occurred" };
        }
        throw new Error(errorData.message || "Failed to create the post");
      }

      const result = await response.json();
      console.log("✅ Post created successfully:", result);

      // Ensure correct data structure before adding
      setPosts((prevPosts) => [...prevPosts, result.post]);

      navigate("/home");
    } catch (err) {
      console.error("❌ Error creating post:", err.message);
      setError(err.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <div>
      <Header />
      <div className="create-post">
        <h1>Create a New Post</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              value={title}
              placeholder="Enter the Topic"
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Content:</label>
            <textarea
              value={content}
              placeholder="What's the content?"
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePosts;
