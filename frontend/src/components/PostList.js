
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostsByUserId, deletePost } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './PostList.css';

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getPostsByUserId(userId);
        setPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.response?.data?.message || 'Failed to load posts. Please try again.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter((post) => post.id !== postId));
        alert('Post deleted successfully!');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const formatTimestamp = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Unknown time';
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="post-list-container">
      <h2>Your Posts</h2>
      {error && <p className="error-message">{error}</p>}
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-avatar">
                  <span>{post.username ? post.username.charAt(0).toUpperCase() : 'U'}</span>
                </div>
                <div className="post-meta">
                  <span className="post-username">{post.username || 'Unknown User'}</span>
                  <span className="post-timestamp">{formatTimestamp(post.createdAt)}</span>
                </div>
              </div>
              <h3 className="post-title">{post.title || 'Untitled'}</h3>
              <p className="post-description">{post.description || 'No description available.'}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title || 'Post image'}
                  className="post-image"
                />
              )}
              {currentUserId === userId && (
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => handleEdit(post.id)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-posts">You haven't created any posts yet.</p>
      )}
    </div>
  );
};

export default PostList;
