
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost } from '../services/api';
import './PostEdit.css';

const PostEdit = () => {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(postId);
        if (post.userId !== userId) {
          alert('You are not authorized to edit this post.');
          navigate(`/profile/${userId}`);
          return;
        }
        setTitle(post.title || '');
        setDescription(post.description || '');
        setImage(post.image || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to load post. Please try again.');
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert('Please log in to edit a post.');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      const postData = { title, description, image };
      await updatePost(postId, postData);
      alert('Post updated successfully!');
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="post-edit-container">
      <h2>Edit Post</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="post-edit-form">
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
        <button onClick={handleSubmit} className="update-btn">
          Update Post
        </button>
      </div>
    </div>
  );
};

export default PostEdit;
