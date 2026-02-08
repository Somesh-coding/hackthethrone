import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSchemeById } from '../services/api';

const SchemeDetails = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemeDetails();
  }, [id]);

  const fetchSchemeDetails = async () => {
    try {
      const response = await getSchemeById(id);
      setScheme(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch scheme details');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading scheme details...</div>;
  }

  if (!scheme) {
    return (
      <div className="container">
        <div className="alert alert-danger">
          <h3>Scheme not found</h3>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero" style={{ padding: '2rem' }}>
        <h1>{scheme.name}</h1>
        <p>{scheme.shortDescription}</p>
        <div>
          <span className="badge badge-primary" style={{ fontSize: '1rem' }}>{scheme.category}</span>
          {scheme.department && (
            <span className="badge badge-success" style={{ fontSize: '1rem', marginLeft: '0.5rem' }}>
              {scheme.department}
            </span>
          )}
        </div>
      </div>

      <div className="container">
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1rem' }}>📋 About the Scheme</h2>
          <p style={{ lineHeight: '1.8' }}>{scheme.description}</p>
        </div>

        {scheme.benefits && scheme.benefits.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1rem' }}>🎁 Benefits</h2>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {scheme.benefits.map((benefit, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1rem' }}>✅ Eligibility Criteria</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {scheme.minAge && (
              <div className="alert alert-info">
                <strong>Minimum Age:</strong> {scheme.minAge} years
              </div>
            )}
            {scheme.maxAge && (
              <div className="alert alert-info">
                <strong>Maximum Age:</strong> {scheme.maxAge} years
              </div>
            )}
            {scheme.maxIncome && (
              <div className="alert alert-info">
                <strong>Max Annual Income:</strong> ₹{scheme.maxIncome.toLocaleString()}
              </div>
            )}
            {scheme.eligibleGenders && scheme.eligibleGenders.length > 0 && (
              <div className="alert alert-info">
                <strong>Gender:</strong> {scheme.eligibleGenders.join(', ')}
              </div>
            )}
            {scheme.eligibleCategories && scheme.eligibleCategories.length > 0 && (
              <div className="alert alert-info">
                <strong>Categories:</strong> {scheme.eligibleCategories.join(', ')}
              </div>
            )}
            {scheme.eligibleStates && scheme.eligibleStates.length > 0 && (
              <div className="alert alert-info">
                <strong>States:</strong> {scheme.eligibleStates.join(', ')}
              </div>
            )}
          </div>
        </div>

        {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1rem' }}>📄 Required Documents</h2>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {scheme.requiredDocuments.map((doc, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {scheme.applicationProcess && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: 'var(--gov-primary)', marginBottom: '1rem' }}>📝 How to Apply</h2>
            <p style={{ lineHeight: '1.8' }}>{scheme.applicationProcess}</p>
          </div>
        )}

        {scheme.applicationDeadline && (
          <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
            <strong>⏰ Application Deadline:</strong>{' '}
            {new Date(scheme.applicationDeadline).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {scheme.officialWebsite && (
            <a 
              href={scheme.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-success"
              style={{ flex: 1, textAlign: 'center' }}
            >
              🔗 Visit Official Website
            </a>
          )}
          <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
            ← Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <h3 style={{ color: 'var(--gov-primary)' }}>📞 Need Help?</h3>
          <p>
            If you have questions about this scheme or need assistance with the application process,
            please contact the respective department or visit their official website.
          </p>
          {scheme.ministry && (
            <p><strong>Ministry:</strong> {scheme.ministry}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
