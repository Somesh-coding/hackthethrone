import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Government Scheme Portal</h1>
          <p className="hero-subtitle">
            Discover government schemes you're eligible for. Simple, transparent, and accessible.
          </p>
          <div className="hero-buttons">
            <Link to="/chatbot" className="btn-primary-large">Chat with YojnaMitra</Link>
            <Link to="/all-schemes" className="btn-secondary-large">Browse All Schemes</Link>
            <Link to="/register" className="btn-tertiary-large">Get Started</Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="impact-section">
        <h2 className="section-title">Our Impact</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Government Schemes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Citizens Helped</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">₹100Cr+</div>
            <div className="stat-label">Benefits Delivered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your account with basic details</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Find Schemes</h3>
            <p>Browse or chat to discover eligible schemes</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Apply</h3>
            <p>Get direct links to official application portals</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Personalized Matching</h3>
            <p>AI-powered recommendations based on your profile and eligibility criteria</p>
          </div>
          <div className="feature-card">
            <h3>Verified Information</h3>
            <p>All scheme details verified and updated regularly from official sources</p>
          </div>
          <div className="feature-card">
            <h3>Easy Application</h3>
            <p>Direct links to official portals with step-by-step guidance</p>
          </div>
          <div className="feature-card">
            <h3>Multilingual Support</h3>
            <p>Available in English and Hindi for better accessibility</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Find Your Benefits?</h2>
        <p>Join thousands of citizens who have discovered government schemes they qualify for</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn-primary-large">Create Account</Link>
          <Link to="/contact" className="btn-outline-large">Contact Support</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
