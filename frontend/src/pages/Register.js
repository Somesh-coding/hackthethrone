import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../services/api';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    age: '',
    state: '',
    district: '',
    occupation: '',
    annualIncome: '',
    category: '',
    gender: ''
  });

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const occupations = [
    { en: 'Farmer', hi: 'किसान' },
    { en: 'Student', hi: 'छात्र / छात्रा' },
    { en: 'Government Employee', hi: 'सरकारी कर्मचारी' },
    { en: 'Private Employee', hi: 'निजी कर्मचारी' },
    { en: 'Self Employed', hi: 'स्व-रोजगार' },
    { en: 'Business Owner', hi: 'व्यवसायी' },
    { en: 'Unemployed', hi: 'बेरोजगार' },
    { en: 'Retired', hi: 'सेवानिवृत्त' },
    { en: 'Daily Wage Worker', hi: 'दिहाड़ी मजदूर' },
    { en: 'Agricultural Laborer', hi: 'कृषि मजदूर' },
    { en: 'Artisan / Craftsman', hi: 'कारीगर / शिल्पकार' },
    { en: 'Housewife', hi: 'गृहिणी' },
    { en: 'Other', hi: 'अन्य' }
  ];

  const categories = [
    { en: 'General', hi: 'सामान्य' },
    { en: 'OBC', hi: 'अन्य पिछड़ा वर्ग' },
    { en: 'SC', hi: 'अनुसूचित जाति' },
    { en: 'ST', hi: 'अनुसूचित जनजाति' }
  ];

  const genders = [
    { en: 'Male', hi: 'पुरुष' },
    { en: 'Female', hi: 'महिला' },
    { en: 'Other', hi: 'अन्य' }
  ];

  const text = {
    en: {
      title: 'Government Scheme Portal Registration',
      subtitle: 'Register to discover government benefits',
      language: 'Language',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phoneNumber: 'Mobile Number',
      age: 'Age',
      state: 'State',
      district: 'District',
      occupation: 'Occupation',
      annualIncome: 'Annual Income (₹)',
      category: 'Category',
      gender: 'Gender',
      selectState: 'Select State',
      selectOccupation: 'Select Occupation',
      selectCategory: 'Select Category',
      selectGender: 'Select Gender',
      register: 'Register',
      haveAccount: 'Already have an account?',
      loginHere: 'Login here',
      mandatoryFields: 'All fields are mandatory',
      govIndia: 'Government of India'
    },
    hi: {
      title: 'सरकारी योजना पोर्टल पंजीकरण',
      subtitle: 'सरकारी लाभों की खोज के लिए पंजीकरण करें',
      language: 'भाषा',
      firstName: 'नाम',
      lastName: 'उपनाम',
      email: 'ईमेल पता',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड की पुष्टि करें',
      phoneNumber: 'मोबाइल नंबर',
      age: 'आयु',
      state: 'राज्य',
      district: 'जिला',
      occupation: 'व्यवसाय',
      annualIncome: 'वार्षिक आय (₹)',
      category: 'श्रेणी',
      gender: 'लिंग',
      selectState: 'राज्य चुनें',
      selectOccupation: 'व्यवसाय चुनें',
      selectCategory: 'श्रेणी चुनें',
      selectGender: 'लिंग चुनें',
      register: 'पंजीकरण करें',
      haveAccount: 'पहले से खाता है?',
      loginHere: 'यहाँ लॉगिन करें',
      mandatoryFields: 'सभी फ़ील्ड अनिवार्य हैं',
      govIndia: 'भारत सरकार'
    }
  };

  const t = text[lang];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error(lang === 'en' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      registerData.age = parseInt(registerData.age);
      registerData.annualIncome = parseFloat(registerData.annualIncome);

      await register(registerData);
      toast.success(lang === 'en' ? 'Registration successful! Please login.' : 'पंजीकरण सफल! कृपया लॉगिन करें।');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.error || (lang === 'en' ? 'Registration failed' : 'पंजीकरण विफल'));
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

      <div className="gov-form-container">
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
          <p className="mandatory-note">* {t.mandatoryFields}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row-gov">
              <div className="form-group-gov">
                <label>{t.firstName} *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-gov">
                <label>{t.lastName} *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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

            <div className="form-row-gov">
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
              <div className="form-group-gov">
                <label>{t.confirmPassword} *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-gov">
              <div className="form-group-gov">
                <label>{t.phoneNumber} *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                  required
                />
              </div>
              <div className="form-group-gov">
                <label>{t.age} *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                  required
                />
              </div>
            </div>

            <div className="form-row-gov">
              <div className="form-group-gov">
                <label>{t.state} *</label>
                <select name="state" value={formData.state} onChange={handleChange} required>
                  <option value="">{t.selectState}</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="form-group-gov">
                <label>{t.district} *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row-gov">
              <div className="form-group-gov">
                <label>{t.occupation} *</label>
                <select name="occupation" value={formData.occupation} onChange={handleChange} required>
                  <option value="">{t.selectOccupation}</option>
                  {occupations.map(occ => (
                    <option key={occ.en} value={occ.en}>
                      {lang === 'hi' ? occ.hi : occ.en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-gov">
                <label>{t.annualIncome} *</label>
                <input
                  type="number"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row-gov">
              <div className="form-group-gov">
                <label>{t.category} *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">{t.selectCategory}</option>
                  {categories.map(cat => (
                    <option key={cat.en} value={cat.en}>
                      {lang === 'hi' ? cat.hi : cat.en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-gov">
                <label>{t.gender} *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">{t.selectGender}</option>
                  {genders.map(gen => (
                    <option key={gen.en} value={gen.en}>
                      {lang === 'hi' ? gen.hi : gen.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-gov-primary">
              {t.register}
            </button>
          </form>
          
          <p className="login-link">
            {t.haveAccount} <a href="/login">{t.loginHere}</a>
          </p>
        </div>
      </div>

      <footer className="gov-footer">
        <p>© 2026 {t.govIndia} | {lang === 'hi' ? 'सरकारी योजना पोर्टल' : 'Government Scheme Portal'}</p>
      </footer>
    </div>
  );
};

export default Register;
