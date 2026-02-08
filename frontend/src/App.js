import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SchemeDetails from './pages/SchemeDetails';
import AdminPanel from './pages/AdminPanel';
import VerifyEmail from './pages/VerifyEmail';
import Profile from './pages/Profile';
import AllSchemes from './pages/AllSchemes';
import Chatbot from './pages/Chatbot';
import ChatbotResults from './pages/ChatbotResults';
import ContactUs from './pages/ContactUs';
import Calendar from './pages/Calendar';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const isAdmin = () => {
    return localStorage.getItem('role') === 'ADMIN';
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  const AdminRoute = ({ children }) => {
    return isAuthenticated() && isAdmin() ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/schemes/:id" element={<SchemeDetails />} />
          <Route path="/all-schemes" element={<AllSchemes />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/chatbot-results" element={<ChatbotResults />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;

