import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ChatbotResults.css';

const ChatbotResults = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const chatbotSchemes = JSON.parse(localStorage.getItem('chatbotSchemes') || '[]');
    setSchemes(chatbotSchemes);
  }, []);

  if (schemes.length === 0) {
    return (
      <div className="results-container">
        <div className="empty-results">
          <h2>No schemes found</h2>
          <p>Start a conversation with YojnaMitra to find schemes!</p>
          <Link to="/chatbot" className="btn-primary">Start Chat</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>🎯 Your Matched Schemes</h1>
        <p>Based on your conversation with YojnaMitra</p>
        <div className="results-stats">
          <span className="stat-badge">✅ {schemes.length} Eligible Schemes</span>
          <Link to="/chatbot" className="restart-link">🔄 Start New Search</Link>
        </div>
      </div>

      <div className="schemes-grid-results">
        {schemes.map((scheme, index) => (
          <div key={scheme.id} className="result-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="result-card-header">
              <span className={`category-badge-result ${scheme.category.toLowerCase().replace(/\s+/g, '-')}`}>
                {scheme.category}
              </span>
              {scheme.department && (
                <span className="dept-badge-result">{scheme.department}</span>
              )}
            </div>

            <h3 className="scheme-title-result">{scheme.name}</h3>

            <p className="scheme-desc-result">
              {scheme.shortDescription || scheme.description.substring(0, 120)}...
            </p>

            {scheme.benefits && scheme.benefits.length > 0 && (
              <div className="benefits-box">
                <strong>✨ Benefits:</strong>
                <ul>
                  {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="eligibility-info">
              {scheme.minAge && (
                <span className="info-tag">🎂 {scheme.minAge}{scheme.maxAge ? `-${scheme.maxAge}` : '+'} years</span>
              )}
              {scheme.maxIncome && (
                <span className="info-tag">💰 ≤ ₹{scheme.maxIncome.toLocaleString()}</span>
              )}
            </div>

            <div className="result-card-footer">
              <Link to={`/schemes/${scheme.id}`} className="btn-view">
                View Full Details →
              </Link>
              {scheme.officialWebsite && (
                <a
                  href={scheme.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-apply"
                >
                  Apply Now ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="next-steps">
        <h2>📋 Next Steps</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-icon">1️⃣</span>
            <h4>Review Details</h4>
            <p>Click on each scheme to see complete eligibility criteria and benefits</p>
          </div>
          <div className="step-card">
            <span className="step-icon">2️⃣</span>
            <h4>Gather Documents</h4>
            <p>Prepare required documents like Aadhar, Income Certificate, etc.</p>
          </div>
          <div className="step-card">
            <span className="step-icon">3️⃣</span>
            <h4>Apply Online</h4>
            <p>Click "Apply Now" to visit official government portals</p>
          </div>
        </div>
      </div>

      <div className="helpful-links">
        <Link to="/all-schemes" className="link-btn">
          🔍 Explore All Schemes
        </Link>
        <Link to="/dashboard" className="link-btn">
          📊 My Dashboard
        </Link>
        <Link to="/chatbot" className="link-btn primary">
          💬 Chat with YojnaMitra Again
        </Link>
      </div>
    </div>
  );
};

export default ChatbotResults;
