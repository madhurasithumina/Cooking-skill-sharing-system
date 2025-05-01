import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      <h1 className="landing-title">Welcome to Cooking Skill Sharing System</h1>
      <p className="landing-subtitle">Share and learn amazing recipes with our community!</p>
      <div className="landing-buttons">
        <Link to="/signup" className="landing-btn signup-btn">Sign Up</Link>
        <Link to="/login" className="landing-btn login-btn">Log In</Link>
      </div>
    </div>
  );
};

export default LandingPage;