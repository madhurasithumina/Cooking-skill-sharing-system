
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import './PostForm.css';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username') || 'Unknown User';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please log in to create a post.');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      const postData = { userId, username, title, description, image };
      await createPost(postData);
      alert('Post created successfully!');
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    }
  };

  return (
    <div className="post-form-container">
      <h2>Create a New Post</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter post description"
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        <button onClick={handleSubmit} className="submit-btn">
          Create Post
        </button>
      </div>
    </div>
  );
};

export default PostForm;
