import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './ContactUs.css';

const ContactUs = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot', time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    type: 'feedback',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How do I register on the portal?',
      answer: 'Click on "Register" in the navigation menu, fill in your details including age, state, occupation, income, and category. You\'ll receive an OTP on your email for verification.'
    },
    {
      question: 'How do I find schemes I\'m eligible for?',
      answer: 'You can use our YojnaMitra chatbot for personalized recommendations, or browse the "All Schemes" page and use filters. After logging in, your dashboard shows schemes specifically matching your profile.'
    },
    {
      question: 'What is YojnaMitra?',
      answer: 'YojnaMitra is our AI-powered chatbot that asks you simple questions about your age, location, income, and occupation, then instantly shows all government schemes you qualify for.'
    },
    {
      question: 'How do I apply for a scheme?',
      answer: 'Click on any scheme card to view full details. Each scheme has an "Apply Now" button that takes you to the official government website for that scheme.'
    },
    {
      question: 'What documents do I need?',
      answer: 'Common documents include: Aadhar Card, Income Certificate, Caste Certificate (if applicable), Bank Account details, and photographs. Specific requirements are listed on each scheme\'s detail page.'
    },
    {
      question: 'How do I change my profile information?',
      answer: 'After logging in, go to the "Profile" page from the navigation menu. You can update your age, income, occupation, and other details there.'
    },
    {
      question: 'Will I get notifications about new schemes?',
      answer: 'Yes! When admin adds a new scheme that matches your profile, you\'ll automatically receive an email notification with details.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard security including JWT authentication, encrypted passwords (BCrypt), and secure HTTPS connections. Your data is never shared with third parties.'
    },
    {
      question: 'Can I save schemes for later?',
      answer: 'Yes! Use the "Save Schemes" button in YojnaMitra chatbot results, or bookmark schemes from the All Schemes page.'
    },
    {
      question: 'What if I forget my password?',
      answer: 'Click "Forgot Password" on the login page. We\'ll send a password reset link to your registered email address.'
    }
  ];

  const quickLinks = [
    { icon: '📞', title: 'Helpline', value: '1800-XXX-XXXX', subtitle: 'Toll Free (9 AM - 6 PM)' },
    { icon: '📧', title: 'Email', value: 'support@govscheme.in', subtitle: 'Response within 24 hours' },
    { icon: '📍', title: 'Address', value: 'Ministry of Electronics & IT, New Delhi', subtitle: 'India - 110001' },
    { icon: '⏰', title: 'Working Hours', value: 'Mon - Fri: 9 AM - 6 PM', subtitle: 'Saturday: 9 AM - 1 PM' }
  ];

  const handleFaqToggle = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: 'Thank you for your message! Our support team will review your query and respond shortly. For immediate assistance, please check our FAQ section or call our helpline.',
        sender: 'bot',
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleFormChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Here you would send to backend
    console.log('Feedback submitted:', feedbackForm);
    
    toast.success(
      feedbackForm.type === 'feedback' 
        ? 'Thank you for your feedback! We appreciate your input.' 
        : 'Complaint registered successfully! Reference ID: #' + Math.floor(Math.random() * 100000)
    );
    
    // Reset form
    setFeedbackForm({
      name: '',
      email: '',
      type: 'feedback',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <h1>📞 Contact & Support</h1>
        <p>हमारी मदद करने में खुशी होगी | We're here to help</p>
      </div>

      {/* Quick Contact Cards */}
      <div className="quick-contacts">
        {quickLinks.map((link, index) => (
          <div key={index} className="quick-contact-card">
            <span className="contact-icon">{link.icon}</span>
            <h3>{link.title}</h3>
            <p className="contact-value">{link.value}</p>
            <p className="contact-subtitle">{link.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="contact-container">
        <div className="contact-tabs">
          <button 
            className={`tab-btn ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => setActiveTab('faq')}
          >
            ❓ FAQs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Live Chat
          </button>
          <button 
            className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            📝 Feedback
          </button>
          <button 
            className={`tab-btn ${activeTab === 'complaint' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaint')}
          >
            ⚠️ Complaint
          </button>
        </div>

        <div className="tab-content">
          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <p className="faq-subtitle">सामान्य प्रश्न | Common Questions</p>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faq-item ${expandedFaq === index ? 'active' : ''}`}>
                    <div className="faq-question" onClick={() => handleFaqToggle(index)}>
                      <h3>{faq.question}</h3>
                      <span className="faq-icon">{expandedFaq === index ? '−' : '+'}</span>
                    </div>
                    {expandedFaq === index && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="faq-help-box">
                <h3>Still have questions?</h3>
                <p>Can't find what you're looking for? Try our live chat or submit a query!</p>
                <div className="help-btns">
                  <button onClick={() => setActiveTab('chat')} className="btn-primary">
                    💬 Start Live Chat
                  </button>
                  <button onClick={() => setActiveTab('feedback')} className="btn-secondary">
                    📧 Send Message
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Live Chat Tab */}
          {activeTab === 'chat' && (
            <div className="chat-section">
              <div className="chat-header">
                <div className="chat-header-info">
                  <span className="chat-avatar">👨‍💼</span>
                  <div>
                    <h3>Support Team</h3>
                    <p><span className="status-online"></span> Online</p>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`chat-message ${msg.sender}`}>
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  placeholder="Type your message..."
                />
                <button onClick={handleChatSend}>Send</button>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="feedback-section">
              <h2>📝 Share Your Feedback</h2>
              <p className="feedback-subtitle">Your opinion helps us improve</p>

              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={feedbackForm.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={feedbackForm.email}
                      onChange={handleFormChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={feedbackForm.subject}
                    onChange={handleFormChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={feedbackForm.message}
                    onChange={handleFormChange}
                    required
                    rows="6"
                    placeholder="Share your thoughts, suggestions, or experience..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Send Feedback
                </button>
              </form>
            </div>
          )}

          {/* Complaint Tab */}
          {activeTab === 'complaint' && (
            <div className="complaint-section">
              <h2>⚠️ Register a Complaint</h2>
              <p className="complaint-subtitle">We take all complaints seriously</p>

              <form onSubmit={handleFormSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={feedbackForm.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={feedbackForm.email}
                      onChange={handleFormChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Complaint Type *</label>
                  <select 
                    name="type" 
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm({...feedbackForm, type: e.target.value})}
                    required
                  >
                    <option value="technical">Technical Issue</option>
                    <option value="incorrect-info">Incorrect Information</option>
                    <option value="scheme-issue">Scheme Application Issue</option>
                    <option value="account">Account Problem</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={feedbackForm.subject}
                    onChange={handleFormChange}
                    required
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Description *</label>
                  <textarea
                    name="message"
                    value={feedbackForm.message}
                    onChange={handleFormChange}
                    required
                    rows="6"
                    placeholder="Please provide as much detail as possible..."
                  ></textarea>
                </div>

                <div className="complaint-notice">
                  <p>📌 You will receive a reference ID via email. Expected resolution time: 3-5 business days.</p>
                </div>

                <button type="submit" className="submit-btn complaint-btn">
                  Submit Complaint
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
