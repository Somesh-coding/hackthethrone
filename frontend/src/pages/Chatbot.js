import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSchemes } from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState({
    age: null,
    state: null,
    category: null,
    income: null,
    occupation: null
  });
  const [matchingSchemes, setMatchingSchemes] = useState([]);
  const [allSchemes, setAllSchemes] = useState([]);
  const messagesEndRef = useRef(null);

  const states = ['Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Rajasthan', 'Kerala', 'Haryana'];
  const categories = ['General', 'OBC', 'SC', 'ST'];
  const occupations = ['Farmer', 'Student', 'Government Employee', 'Private Employee', 'Self Employed', 'Business Owner', 'Unemployed', 'Daily Wage Worker'];

  useEffect(() => {
    fetchSchemes();
    startConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSchemes = async () => {
    try {
      const response = await getAllSchemes();
      setAllSchemes(response.data);
    } catch (error) {
      console.error('Failed to fetch schemes');
    }
  };

  const addMessage = (text, sender, options = null) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      options
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const typeMessage = async (text, sender, options = null, delay = 1000) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    addMessage(text, sender, options);
  };

  const startConversation = async () => {
    await typeMessage('नमस्ते! Hello! 🇮🇳', 'bot', null, 500);
    await typeMessage("I'm YojnaMitra, your personal guide to government schemes.", 'bot', null, 1000);
    await typeMessage("I'll help you find schemes you're eligible for by asking a few simple questions.", 'bot', null, 1500);
    await typeMessage("Let's start! What is your age?", 'bot', { type: 'age' }, 2000);
  };

  const handleAgeInput = (age) => {
    addMessage(age + ' years', 'user');
    const ageNum = parseInt(age);
    if (ageNum < 1 || ageNum > 120) {
      typeMessage("Please enter a valid age between 1 and 120.", 'bot', { type: 'age' }, 500);
      return;
    }
    setUserProfile(prev => ({ ...prev, age: ageNum }));
    setCurrentStep(1);
    typeMessage("Great! Which state do you live in?", 'bot', { type: 'state', options: states }, 1000);
  };

  const handleStateSelect = (state) => {
    addMessage(state, 'user');
    setUserProfile(prev => ({ ...prev, state }));
    setCurrentStep(2);
    typeMessage("Perfect! What is your social category?", 'bot', { type: 'category', options: categories }, 1000);
  };

  const handleCategorySelect = (category) => {
    addMessage(category, 'user');
    setUserProfile(prev => ({ ...prev, category }));
    setCurrentStep(3);
    typeMessage("Thank you! What is your annual income (in ₹)?", 'bot', { type: 'income' }, 1000);
  };

  const handleIncomeInput = (income) => {
    addMessage('₹' + parseInt(income).toLocaleString(), 'user');
    const incomeNum = parseFloat(income);
    setUserProfile(prev => ({ ...prev, income: incomeNum }));
    setCurrentStep(4);
    typeMessage("Almost done! What is your occupation?", 'bot', { type: 'occupation', options: occupations }, 1000);
  };

  const handleOccupationSelect = async (occupation) => {
    addMessage(occupation, 'user');
    const finalProfile = { ...userProfile, occupation };
    setUserProfile(finalProfile);
    setCurrentStep(5);
    
    await typeMessage("Analyzing your eligibility... 🔍", 'bot', null, 500);
    
    // Filter matching schemes
    const matches = filterSchemes(finalProfile);
    setMatchingSchemes(matches);
    
    await typeMessage(
      `Excellent news! You qualify for ${matches.length} government scheme${matches.length !== 1 ? 's' : ''}! 🎉`,
      'bot',
      null,
      1500
    );
    
    if (matches.length > 0) {
      await typeMessage(
        "Here's what you can do next:",
        'bot',
        { type: 'actions', schemes: matches },
        2000
      );
    } else {
      await typeMessage(
        "Don't worry! New schemes are added regularly. Would you like to:",
        'bot',
        { type: 'no-matches' },
        2000
      );
    }
  };

  const filterSchemes = (profile) => {
    return allSchemes.filter(scheme => {
      // Age check
      if (scheme.minAge && profile.age < scheme.minAge) return false;
      if (scheme.maxAge && profile.age > scheme.maxAge) return false;
      
      // Income check
      if (scheme.maxIncome && profile.income > scheme.maxIncome) return false;
      
      // State check
      if (scheme.eligibleStates && scheme.eligibleStates.length > 0 &&
          !scheme.eligibleStates.includes('All') &&
          !scheme.eligibleStates.includes(profile.state)) return false;
      
      // Category check
      if (scheme.eligibleCategories && scheme.eligibleCategories.length > 0 &&
          !scheme.eligibleCategories.includes('All') &&
          !scheme.eligibleCategories.includes(profile.category)) return false;
      
      // Occupation check
      if (scheme.eligibleOccupations && scheme.eligibleOccupations.length > 0 &&
          !scheme.eligibleOccupations.includes(profile.occupation)) return false;
      
      return true;
    });
  };

  const handleViewSchemes = () => {
    localStorage.setItem('chatbotSchemes', JSON.stringify(matchingSchemes));
    navigate('/chatbot-results');
  };

  const handleSaveSchemes = () => {
    const saved = JSON.parse(localStorage.getItem('savedSchemes') || '[]');
    const newSchemes = matchingSchemes.filter(s => !saved.find(saved => saved.id === s.id));
    localStorage.setItem('savedSchemes', JSON.stringify([...saved, ...newSchemes]));
    typeMessage(`Saved ${newSchemes.length} new scheme${newSchemes.length !== 1 ? 's' : ''} to your profile! ✅`, 'bot', null, 500);
  };

  const handleCheckDocuments = () => {
    const docs = new Set();
    matchingSchemes.forEach(scheme => {
      if (scheme.requiredDocuments) {
        scheme.requiredDocuments.forEach(doc => docs.add(doc));
      }
    });
    const docList = Array.from(docs).join(', ');
    typeMessage(
      `Common documents you'll need: ${docList || 'Check individual scheme details'}`,
      'bot',
      null,
      500
    );
  };

  const handleRestartChat = () => {
    setMessages([]);
    setCurrentStep(0);
    setUserProfile({ age: null, state: null, category: null, income: null, occupation: null });
    setMatchingSchemes([]);
    startConversation();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <span className="chatbot-logo">🇮🇳</span>
          <div>
            <h3>YojnaMitra</h3>
            <p className="chatbot-status">
              <span className="status-dot"></span> Online
            </p>
          </div>
        </div>
        <button className="restart-btn" onClick={handleRestartChat} title="Restart conversation">
          🔄
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
              
              {message.options && message.options.type === 'state' && (
                <div className="quick-replies">
                  {message.options.options.map((option) => (
                    <button key={option} onClick={() => handleStateSelect(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {message.options && message.options.type === 'category' && (
                <div className="quick-replies">
                  {message.options.options.map((option) => (
                    <button key={option} onClick={() => handleCategorySelect(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {message.options && message.options.type === 'occupation' && (
                <div className="quick-replies occupation-grid">
                  {message.options.options.map((option) => (
                    <button key={option} onClick={() => handleOccupationSelect(option)}>
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {message.options && message.options.type === 'actions' && (
                <div className="action-buttons">
                  <button className="action-btn view-btn" onClick={handleViewSchemes}>
                    📋 View Schemes
                  </button>
                  <button className="action-btn save-btn" onClick={handleSaveSchemes}>
                    💾 Save Schemes
                  </button>
                  <button className="action-btn docs-btn" onClick={handleCheckDocuments}>
                    📄 Check Documents
                  </button>
                </div>
              )}
              
              {message.options && message.options.type === 'no-matches' && (
                <div className="action-buttons">
                  <button className="action-btn view-btn" onClick={() => navigate('/all-schemes')}>
                    📋 Browse All Schemes
                  </button>
                  <button className="action-btn restart-btn-inline" onClick={handleRestartChat}>
                    🔄 Start Again
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-content typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {!isTyping && currentStep < 5 && (
        <div className="chatbot-input">
          {currentStep === 0 && (
            <AgeInput onSubmit={handleAgeInput} />
          )}
          {currentStep === 3 && (
            <IncomeInput onSubmit={handleIncomeInput} />
          )}
        </div>
      )}
    </div>
  );
};

// Age Input Component
const AgeInput = ({ onSubmit }) => {
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (age) {
      onSubmit(age);
      setAge('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Enter your age..."
        min="1"
        max="120"
        autoFocus
      />
      <button type="submit">Send</button>
    </form>
  );
};

// Income Input Component
const IncomeInput = ({ onSubmit }) => {
  const [income, setIncome] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (income) {
      onSubmit(income);
      setIncome('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <input
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        placeholder="Enter annual income in ₹..."
        min="0"
        autoFocus
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default Chatbot;
