import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-wrapper">
      <div className="background-overlay"></div>
      <header className="landing-header">
        <div className="logo">🍳 SkillCook</div>
        <nav className="landing-nav">
          <button className="nav-btn" onClick={handleLogin}>Log In</button>
          <button className="nav-btn signup" onClick={handleSignUp}>Sign Up</button>
        </nav>
      </header>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Unleash Your Inner Chef</h1>
          <p className="hero-subtitle">
            Discover recipes, connect with culinary experts, and ignite your passion for cooking.
          </p>
          <button className="hero-cta" onClick={handleSignUp}>
            Start Cooking Now
          </button>
        </div>
        <div className="hero-visual">
          <div className="cooking-orbit">
            <span className="ingredient tomato"></span>
            <span className="ingredient basil"></span>
            <span className="ingredient cheese"></span>
            <span className="ingredient pasta"></span>
          </div>
        </div>
      </section>
      <section className="features-section">
        <h2 className="features-title">Why SkillCook Shines</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Share Your Recipes</h3>
            <p>Create and share your culinary masterpieces with the world.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍🍳</div>
            <h3>Learn from Masters</h3>
            <p>Unlock pro tips and techniques from top chefs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Join the Foodie Tribe</h3>
            <p>Connect with a vibrant community of food enthusiasts.</p>
          </div>
        </div>
      </section>
      <section className="cta-banner">
        <h2 className="cta-title">Ready to Cook with Passion?</h2>
        <p className="cta-subtitle">Join SkillCook and transform your kitchen into a culinary haven!</p>
        <button className="cta-button" onClick={handleSignUp}>Join Now</button>
      </section>
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2025 SkillCook - Crafting Culinary Dreams</p>
          <div className="social-links">
            <a href="#" className="social-icon">📷</a>
            <a href="#" className="social-icon">🐦</a>
            <a href="#" className="social-icon">📘</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;