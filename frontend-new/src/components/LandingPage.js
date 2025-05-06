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
          <h1 className="hero-title">Master the Art of Cooking</h1>
          <p className="hero-subtitle">
            Connect with chefs, share recipes, and ignite your culinary passion.
          </p>
          <button className="hero-cta" onClick={handleSignUp}>
            Start Your Journey
          </button>
        </div>
        <div className="hero-visual">
          <div className="cooking-orbit">
            <span className="ingredient tomato"></span>
            <span className="ingredient basil"></span>
            <span className="ingredient cheese"></span>
          </div>
        </div>
      </section>
      <section className="features-section">
        <h2 className="features-title">Why Join SkillCook?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Share Recipes</h3>
            <p>Post your favorite dishes and inspire others.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍🍳</div>
            <h3>Learn from Pros</h3>
            <p>Gain tips from expert cooks worldwide.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌟</div>
            <h3>Build Community</h3>
            <p>Connect with food lovers like you.</p>
          </div>
        </div>
      </section>
      <section className="cta-banner">
        <h2 className="cta-title">Ready to Cook Like a Pro?</h2>
        <p className="cta-subtitle">Join SkillCook today and start your culinary adventure!</p>
        <button className="cta-button" onClick={handleSignUp}>Get Started</button>
      </section>
      <footer className="landing-footer">
        <p>© 2025 SkillCook - Where Culinary Dreams Come Alive</p>
      </footer>
    </div>
  );
};

export default LandingPage;