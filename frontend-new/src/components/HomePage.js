import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="home-wrapper">
      <h2 className="home-title">Welcome, {username}!</h2>
      <p className="home-subtitle">What would you like to do today?</p>
      <div className="home-options">
        <Link to="/post/create" className="home-btn">Create a Post</Link>
        <Link to="/post/list" className="home-btn">View Posts</Link>
        <Link to="/workplan/create" className="home-btn">Create a Work Plan</Link>
        <Link to="/workplan/list" className="home-btn">View Work Plans</Link>
        <Link to={`/profile/${localStorage.getItem('userId')}`} className="home-btn">My Profile</Link>
      </div>
    </div>
  );
};

export default HomePage;