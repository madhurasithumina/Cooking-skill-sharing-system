import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, getPostsByUserId, getWorkPlansByUser } from '../services/api';
import './UserProfile.css';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [workPlans, setWorkPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        const idToFetch = userId || storedUserId;
        if (!idToFetch) {
          navigate('/login');
          return;
        }

        const userData = await getUser(idToFetch);
        const userPosts = await getPostsByUserId(idToFetch);
        const userWorkPlans = await getWorkPlansByUser(idToFetch);

        setUser(userData);
        setPosts(userPosts);
        setWorkPlans(userWorkPlans);
        setLoading(false);
      } catch (err) {
        setError('Failed to load user data.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>{user?.username}'s Profile</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="profile-section">
        <h3>Email: {user?.email}</h3>
      </div>
      <div className="profile-section">
        <h3>Posts</h3>
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-card">
                <h4>{post.title}</h4>
                <p>{post.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-posts">No posts yet.</p>
        )}
      </div>
      <div className="profile-section">
        <h3>Work Plans</h3>
        {workPlans.length > 0 ? (
          <div className="workplans-grid">
            {workPlans.map((plan) => (
              <div key={plan.id} className="workplan-card">
                <h4>{plan.title}</h4>
                <p>{plan.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-workplans">No work plans yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;