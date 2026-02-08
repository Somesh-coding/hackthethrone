import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import './Register.css';

const Login = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showOtp, setShowOtp] = useState(false);
  const [userData, setUserData] = useState(null);

  const text = {
    en: {
      title: 'Login to Government Scheme Portal',
      subtitle: 'Access your personalized dashboard',
      language: 'Language',
      email: 'Email Address',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      govIndia: 'Government of India'
    },
    hi: {
      title: 'सरकारी योजना पोर्टल में लॉगिन करें',
      subtitle: 'अपने व्यक्तिगत डैशबोर्ड तक पहुंचें',
      language: 'भाषा',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      login: 'लॉगिन',
      noAccount: 'खाता नहीं है?',
      registerHere: 'यहाँ पंजीकरण करें',
      govIndia: 'भारत सरकार'
    }
  };

  const t = text[lang];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const data = response.data;
      
      if (data.token) {
        // Direct login - user already verified
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('role', data.role);
        
        toast.success(lang === 'en' ? 'Login successful!' : 'लॉगिन सफल!');
        
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // OTP required
        setUserData(data);
        setShowOtp(true);
        toast.info(lang === 'en' ? 'OTP sent to your email!' : 'आपके ईमेल पर OTP भेजा गया है!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || (lang === 'en' ? 'Login failed' : 'लॉगिन विफल'));
    }
  };

  if (showOtp) {
    return <OtpVerification lang={lang} email={formData.email} userData={userData} />;
  }

  return (
    <div className="gov-register-page">
      <div className="gov-header">
        <div className="emblem">
          <span style={{fontSize: '60px'}}>🇮🇳</span>
        </div>
        <div className="header-text">
          <h1>{lang === 'hi' ? 'भारत सरकार' : 'Government of India'}</h1>
          <h2>{t.title}</h2>
        </div>
      </div>

      <div className="gov-form-container" style={{maxWidth: '500px'}}>
        <div className="language-selector">
          <label>{t.language}:</label>
          <button 
            className={lang === 'en' ? 'active' : ''} 
            onClick={() => setLang('en')}
          >
            English
          </button>
          <button 
            className={lang === 'hi' ? 'active' : ''} 
            onClick={() => setLang('hi')}
          >
            हिन्दी
          </button>
        </div>

        <div className="form-card">
          <h3>{t.subtitle}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group-gov">
              <label>{t.email} *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group-gov">
              <label>{t.password} *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-gov-primary">
              {t.login}
            </button>
          </form>
          
          <p className="login-link">
            {t.noAccount} <a href="/register">{t.registerHere}</a>
          </p>
        </div>
      </div>

      <footer className="gov-footer">
        <p>© 2026 {t.govIndia} | {lang === 'hi' ? 'सरकारी योजना पोर्टल' : 'Government Scheme Portal'}</p>
      </footer>
    </div>
  );
};

// OTP Verification Component
const OtpVerification = ({ lang, email, userData }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const text = {
    en: {
      title: 'Email Verification',
      subtitle: 'Enter the 6-digit OTP sent to your email',
      otpSentTo: 'OTP sent to:',
      enterOtp: 'Enter OTP',
      verify: 'Verify & Login',
      resendOtp: 'Resend OTP',
      govIndia: 'Government of India'
    },
    hi: {
      title: 'ईमेल सत्यापन',
      subtitle: 'अपने ईमेल पर भेजे गए 6 अंकों का OTP दर्ज करें',
      otpSentTo: 'OTP भेजा गया:',
      enterOtp: 'OTP दर्ज करें',
      verify: 'सत्यापित करें और लॉगिन करें',
      resendOtp: 'OTP पुनः भेजें',
      govIndia: 'भारत सरकार'
    }
  };

  const t = text[lang];

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('role', data.role);
        
        toast.success(lang === 'en' ? 'Email verified successfully!' : 'ईमेल सफलतापूर्वक सत्यापित!');
        
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.error || (lang === 'en' ? 'Invalid OTP' : 'अमान्य OTP'));
      }
    } catch (error) {
      toast.error(lang === 'en' ? 'Verification failed' : 'सत्यापन विफल');
    }
  };

  const handleResend = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      toast.success(lang === 'en' ? 'OTP resent successfully!' : 'OTP पुनः भेजा गया!');
    } catch (error) {
      toast.error(lang === 'en' ? 'Failed to resend OTP' : 'OTP पुनः भेजने में विफल');
    }
  };

  return (
    <div className="gov-register-page">
      <div className="gov-header">
        <div className="emblem">
          <span style={{fontSize: '60px'}}>🇮🇳</span>
        </div>
        <div className="header-text">
          <h1>{lang === 'hi' ? 'भारत सरकार' : 'Government of India'}</h1>
          <h2>{t.title}</h2>
        </div>
      </div>

      <div className="gov-form-container" style={{maxWidth: '500px'}}>
        <div className="form-card">
          <h3>{t.subtitle}</h3>
          <div className="alert alert-info" style={{background: '#E3F2FD', padding: '15px', borderRadius: '4px', marginBottom: '20px'}}>
            <p><strong>{t.otpSentTo}</strong> {email}</p>
            <p style={{fontSize: '0.9rem', margin: '5px 0'}}>
              {lang === 'en' ? 'Valid for 10 minutes' : '10 मिनट के लिए वैध'}
            </p>
          </div>
          
          <form onSubmit={handleVerify}>
            <div className="form-group-gov">
              <label>{t.enterOtp} *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                pattern="[0-9]{6}"
                placeholder="Enter 6-digit OTP"
                required
                style={{textAlign: 'center', fontSize: '1.5rem', letterSpacing: '10px'}}
              />
            </div>

            <button type="submit" className="btn-gov-primary">
              {t.verify}
            </button>
          </form>
          
          <p className="login-link">
            <button 
              onClick={handleResend}
              style={{background: 'none', border: 'none', color: '#1565C0', cursor: 'pointer', textDecoration: 'underline'}}
            >
              {t.resendOtp}
            </button>
          </p>
        </div>
      </div>

      <footer className="gov-footer">
        <p>© 2026 {t.govIndia} | {lang === 'hi' ? 'सरकारी योजना पोर्टल' : 'Government Scheme Portal'}</p>
      </footer>
    </div>
  );
};

export default Login;
