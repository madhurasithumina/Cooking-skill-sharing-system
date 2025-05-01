
import React, { useEffect, useState } from 'react';
import { 
  getAllPosts, 
  createLike, 
  getLikesByPostId, 
  deleteLike, 
  createComment, 
  getCommentsByPostId, 
  updateComment, 
  deleteComment 
} from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import './ExplorePage.css';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPostsAndInteractions = async () => {
      setLoading(true);
      try {
        const allPosts = await getAllPosts();
        if (!Array.isArray(allPosts)) {
          throw new Error('Invalid response format for posts');
        }
        setPosts(allPosts);

        const likesData = {};
        const commentsData = {};
        for (const post of allPosts) {
          try {
            const postLikes = await getLikesByPostId(post.id);
            const postComments = await getCommentsByPostId(post.id);
            likesData[post.id] = Array.isArray(postLikes) ? postLikes : [];
            commentsData[post.id] = Array.isArray(postComments) ? postComments : [];
          } catch (err) {
            console.error(`Error fetching interactions for post ${post.id}:`, err);
            likesData[post.id] = [];
            commentsData[post.id] = [];
          }
        }
        setLikes(likesData);
        setComments(commentsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts or interactions:', error);
        setError(error.response?.data?.message || 'Failed to load posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsAndInteractions();
  }, []);

  const handleLike = async (postId) => {
    if (!userId) {
      alert('Please log in to like posts.');
      return;
    }
    try {
      await createLike(userId, postId);
      const updatedLikes = await getLikesByPostId(postId);
      setLikes((prev) => ({ ...prev, [postId]: updatedLikes }));
    } catch (error) {
      console.error('Error liking post:', error);
      alert('Failed to like post.');
    }
  };

  const handleUnlike = async (postId) => {
    if (!userId) {
      alert('Please log in to unlike posts.');
      return;
    }
    try {
      await deleteLike(userId, postId);
      const updatedLikes = await getLikesByPostId(postId);
      setLikes((prev) => ({ ...prev, [postId]: updatedLikes }));
    } catch (error) {
      console.error('Error unliking post:', error);
      alert('Failed to unlike post.');
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!userId) {
      alert('Please log in to comment.');
      return;
    }
    const content = newComment[postId]?.trim();
    if (!content) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      await createComment(userId, postId, content);
      const updatedComments = await getCommentsByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setNewComment((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId, postId) => {
    if (!editContent.trim()) {
      alert('Comment cannot be empty.');
      return;
    }
    try {
      await updateComment(commentId, editContent);
      const updatedComments = await getCommentsByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment.');
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      await deleteComment(commentId);
      const updatedComments = await getCommentsByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: updatedComments }));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
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

  return (
    <div className="explore-container">
      <h1 className="explore-header">Explore Culinary Creations</h1>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <div className="loading-spinner">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="user-avatar">
                    <span>{post.username ? post.username.charAt(0).toUpperCase() : 'U'}</span>
                  </div>
                  <div className="post-meta">
                    <span className="post-username">{post.username || 'Unknown User'}</span>
                    <span className="post-timestamp">
                      {formatTimestamp(post.createdAt)}
                    </span>
                  </div>
                </div>
                <h2 className="post-title">{post.title || post.content || 'Untitled'}</h2>
                <p className="post-description">{post.description || post.content || 'No description available.'}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title || post.content || 'Post image'}
                    className="post-image"
                  />
                )}
                <div className="post-actions">
                  <div className="likes-container">
                    <button
                      className={`like-btn ${likes[post.id]?.some((like) => like.userId === userId) ? 'liked' : ''}`}
                      onClick={() =>
                        likes[post.id]?.some((like) => like.userId === userId)
                          ? handleUnlike(post.id)
                          : handleLike(post.id)
                      }
                    >
                      {likes[post.id]?.some((like) => like.userId === userId) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span className="likes-count">{likes[post.id]?.length || 0}</span>
                    </button>
                  </div>
                </div>
                <div className="comments-container">
                  <h3 className="comments-header">
                    <FaComment /> Comments
                  </h3>
                  {comments[post.id]?.length > 0 ? (
                    comments[post.id].map((comment) => (
                      <div key={comment.id} className="comment-item">
                        {editingComment === comment.id ? (
                          <div className="edit-comment-form">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="edit-comment-input"
                            />
                            <div className="edit-comment-actions">
                              <button
                                className="save-btn"
                                onClick={() => handleUpdateComment(comment.id, post.id)}
                              >
                                Save
                              </button>
                              <button
                                className="cancel-btn"
                                onClick={() => setEditingComment(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="comment-content">
                            <div className="comment-header">
                              <span className="comment-username">{comment.username || comment.userId}</span>
                              <span className="comment-timestamp">
                                {formatTimestamp(comment.createdAt)}
                              </span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                            {comment.userId === userId && (
                              <div className="comment-actions">
                                <button
                                  className="edit-comment-btn"
                                  onClick={() => handleEditComment(comment)}
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button
                                  className="delete-comment-btn"
                                  onClick={() => handleDeleteComment(comment.id, post.id)}
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  )}
                  <div className="comment-form">
                    <textarea
                      value={newComment[post.id] || ''}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      placeholder="Share your thoughts..."
                      className="comment-input"
                    />
                    <button
                      className="submit-comment-btn"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-posts">No posts available. Start sharing your culinary creations!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
