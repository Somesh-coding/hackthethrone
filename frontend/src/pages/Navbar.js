import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar-improved">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand-improved">
          <span className="brand-text">सरकारी योजना पोर्टल</span>
          <span className="brand-subtitle">Government Scheme Portal</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          
          <Link to="/all-schemes" className="nav-link">
            <span className="nav-icon">📋</span>
            <span>All Schemes</span>
          </Link>
          
          <Link to="/chatbot" className="nav-link chatbot-link-improved">
            <span className="nav-icon">💬</span>
            <span>YojnaMitra</span>
          </Link>
          
          <Link to="/calendar" className="nav-link">
            <span className="nav-icon">📅</span>
            <span>Calendar</span>
          </Link>
          
          <Link to="/contact" className="nav-link">
            <span className="nav-icon">📞</span>
            <span>Contact</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                <span>My Schemes</span>
              </Link>
              
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                <span>Profile</span>
              </Link>
              
              {role === 'ADMIN' && (
                <Link to="/admin" className="nav-link admin-link">
                  <span className="nav-icon">⚙️</span>
                  <span>Admin</span>
                </Link>
              )}
              
              <div className="user-info">
                <span className="user-name">{userName}</span>
              </div>
              
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link login-btn-nav">
                <span className="nav-icon">🔐</span>
                <span>Login</span>
              </Link>
              
              <Link to="/register" className="nav-link register-btn-nav">
                <span className="nav-icon">📝</span>
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
