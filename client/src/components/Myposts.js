import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaThumbsUp } from 'react-icons/fa'; 
import "./Mypost.css";
import Header from "../Header";

const Mypost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [previousTitle, setPreviousTitle] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const [LikeComments, setLikeComments] = useState([]);

  useEffect(() => {
    console.log("Fetching posts and like comments for profilename:", username);

    const fetchData = async () => {
      try {
        // Fetch posts
        const postsResponse = await fetch(`http://localhost:4000/myposts/${username}`);
        const postsData = postsResponse.ok ? await postsResponse.json() : null;

        // Fetch like comments
        const likeCommentsResponse = await fetch("http://localhost:4000/fix-likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }), // Send username in request body
        });
        const likeCommentsData = likeCommentsResponse.ok ? await likeCommentsResponse.json() : null;

        if (postsData) setPosts(postsData);
        if (likeCommentsData?.data) setLikeComments(likeCommentsData.data);

      } catch (error) {
        console.error("Error fetching data:", error);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postToDelete),
      });
  
      if (response.ok) {
        console.log("Post deleted successfully");
  
        // Update the UI after successful deletion
        setPosts((prevPosts) =>
          prevPosts.filter(
            (p) =>
              p.username !== post.username ||
              p.title !== post.title ||
              p.content !== post.content
          )
        );
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  
  // Handle save and send to backend
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
      const response = await fetch(`http://localhost:4000/updatepost`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        console.log("Post updated successfully");

        // Update the UI after a successful update
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

  return (
    <div>
      <Header />
      <div className="myposts-container">
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map((post) => {
            // Find the like count for this post
            const matchingLikeComment = LikeComments.find(
              (likeComment) => likeComment.username === username && likeComment.title === post.title
            );

            return (
              <div key={post._id} className="post">
                {/* Editable title */}
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

                {/* Editable content */}
                {editingPost === post._id ? (
                  <textarea
                    value={updatedContent}
                    onChange={(e) => setUpdatedContent(e.target.value)}
                    className="edit-textarea"
                  />
                ) : (
                  <p>{post.content}</p>
                )}

                {/* Like Count */}
                <p> <FaThumbsUp size={30} /> {matchingLikeComment ? matchingLikeComment.like : 0}</p>

                <small>Created at: {new Date(post.createdAt).toLocaleString()}</small>

                {/* Action buttons */}
                <div className="post-actions">
                  {editingPost === post._id ? (
                    <button className="save-btn" onClick={handleSave}>Save</button>
                  ) : (
                    <FaEdit className="edit-icon" onClick={() => handleEdit(post)} />
                  )}
                  <FaTrash className="delete-icon" onClick={() => handleDelete(post)}/>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Mypost;
