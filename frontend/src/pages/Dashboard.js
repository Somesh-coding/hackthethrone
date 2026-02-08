import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getEligibleSchemes } from '../services/api';

const Dashboard = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchEligibleSchemes();
  }, []);

  const fetchEligibleSchemes = async () => {
    try {
      const response = await getEligibleSchemes(userId);
      setSchemes(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch schemes');
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(schemes.map(s => s.category))];

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading">Loading your eligible schemes...</div>;
  }

  return (
    <div>
      <div className="hero" style={{ padding: '2rem' }}>
        <h1>Welcome, {userName}! 👋</h1>
        <p>You are eligible for {schemes.length} government schemes</p>
      </div>

      <div className="container">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                flex: 1, 
                minWidth: '250px',
                padding: '0.75rem',
                border: '1px solid var(--gov-border)',
                borderRadius: '4px'
              }}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid var(--gov-border)',
                borderRadius: '4px'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="alert alert-info">
            <h3>No schemes found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <>
            <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1.5rem' }}>
              Your Eligible Schemes ({filteredSchemes.length})
            </h2>
            
            <div className="schemes-grid">
              {filteredSchemes.map(scheme => (
                <div key={scheme.id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{scheme.name}</h3>
                    <div>
                      <span className="badge badge-primary">{scheme.category}</span>
                      {scheme.department && (
                        <span className="badge badge-success">{scheme.department}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <p>{scheme.shortDescription || scheme.description.substring(0, 150)}...</p>
                    
                    {scheme.benefits && scheme.benefits.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <strong>Key Benefits:</strong>
                        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                          {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} style={{ marginBottom: '0.25rem' }}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <Link to={`/schemes/${scheme.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    {scheme.officialWebsite && (
                      <a 
                        href={scheme.officialWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-success"
                      >
                        Apply Now ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="alert alert-info" style={{ marginTop: '2rem' }}>
          <h3>💡 Pro Tip</h3>
          <p>
            Keep your profile updated to ensure you receive notifications about new schemes
            that match your eligibility criteria. You can update your profile{' '}
            <Link to="/profile" style={{ color: 'var(--gov-primary)', fontWeight: 'bold' }}>here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
