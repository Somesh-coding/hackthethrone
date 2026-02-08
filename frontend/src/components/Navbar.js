import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar-clean">
      <div className="navbar-container-clean">
        {/* Logo Section */}
        <Link to="/" className="navbar-logo-clean">
          <div className="logo-text">
            <div className="logo-hindi">सरकारी योजना पोर्टल</div>
            <div className="logo-english">Government Scheme Portal</div>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="navbar-menu-clean">
          <Link to="/" className="nav-item-clean">Home</Link>
          <Link to="/all-schemes" className="nav-item-clean">All Schemes</Link>
          <Link to="/chatbot" className="nav-item-clean nav-highlight">YojnaMitra</Link>
          <Link to="/calendar" className="nav-item-clean">Calendar</Link>
          <Link to="/contact" className="nav-item-clean">Contact</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-item-clean">My Schemes</Link>
              <Link to="/profile" className="nav-item-clean">Profile</Link>
              {role === 'ADMIN' && (
                <Link to="/admin" className="nav-item-clean nav-admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="nav-btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn-login">Login</Link>
              <Link to="/register" className="nav-btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
