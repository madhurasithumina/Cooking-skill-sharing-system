import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getFollowing } from '../services/api';
import FollowButton from './FollowButton';
import './HomePage.css';
import regImage from '../assets/reg.jpg'; // Import the image

const HomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const otherUsers = allUsers.filter(user => user.id !== currentUserId);
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleProfile = () => navigate('/profile');
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };
  const viewProfile = (userId) => navigate(`/profile/${userId}`);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleExploreClick = () => navigate('/explore');

  return (
    <div
      className="home-wrapper"
      style={{
        backgroundImage: `url(${regImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        imageRendering: '-webkit-optimize-contrast',
        imageRendering: 'crisp-edges',
        imageRendering: 'pixelated',
      }}
    >
      <header className="home-header">
        <div className="header-logo">
          <span className="logo-icon">🍳</span>
          <h1 className="logo-text">CookSphere</h1>
        </div>
        <nav className="header-nav">
          <input
            type="text"
            className="search-bar"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="nav-btn profile" onClick={handleProfile}>
            Profile
          </button>
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
          <button className="nav-btn explore" onClick={handleExploreClick}>
            Explore
          </button>
        </nav>
      </header>

      <section className="home-hero">
        <h2 className="hero-title">Your Cooking Community</h2>
        <p className="hero-subtitle">Follow chefs, share skills, and explore recipes.</p>
      </section>

      <section className="follow-section">
        <h3 className="follow-title">People to Follow</h3>
        <div className="follow-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.id} className="follow-item">
                <div className="user-info" onClick={() => viewProfile(user.id)}>
                  <div className="user-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} className="user-image" />
                    ) : (
                      <span>{user.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="follow-name">{user.username}</span>
                </div>
                <FollowButton currentUserId={currentUserId} targetUserId={user.id} />
              </div>
            ))
          ) : (
            <p>No users found matching your search.</p>
          )}
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 CookSphere - Fueling Culinary Creativity</p>
      </footer>
    </div>
  );
};

export default HomePage;