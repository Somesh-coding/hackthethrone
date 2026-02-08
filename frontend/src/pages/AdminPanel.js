import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllSchemes, createScheme, updateScheme, deleteScheme } from '../services/api';

const AdminPanel = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    department: '',
    ministry: '',
    officialWebsite: '',
    category: '',
    benefits: '',
    minAge: '',
    maxAge: '',
    eligibleStates: '',
    eligibleGenders: '',
    maxIncome: '',
    eligibleCategories: '',
    eligibleOccupations: '',
    applicationProcess: '',
    requiredDocuments: '',
    applicationDeadline: ''
  });

  const categories = ['Education', 'Health', 'Agriculture', 'Employment', 'Social Welfare', 'Housing', 'Business'];
  const states = ['All', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'West Bengal'];
  const genders = ['All', 'Male', 'Female'];
  const categoryTypes = ['All', 'General', 'OBC', 'SC', 'ST'];

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await getAllSchemes();
      setSchemes(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch schemes');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      department: '',
      ministry: '',
      officialWebsite: '',
      category: '',
      benefits: '',
      minAge: '',
      maxAge: '',
      eligibleStates: '',
      eligibleGenders: '',
      maxIncome: '',
      eligibleCategories: '',
      eligibleOccupations: '',
      applicationProcess: '',
      requiredDocuments: '',
      applicationDeadline: ''
    });
    setEditingScheme(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const schemeData = {
        ...formData,
        benefits: formData.benefits.split('\n').filter(b => b.trim()),
        eligibleStates: formData.eligibleStates.split(',').map(s => s.trim()).filter(s => s),
        eligibleGenders: formData.eligibleGenders.split(',').map(g => g.trim()).filter(g => g),
        eligibleCategories: formData.eligibleCategories.split(',').map(c => c.trim()).filter(c => c),
        eligibleOccupations: formData.eligibleOccupations.split(',').map(o => o.trim()).filter(o => o),
        requiredDocuments: formData.requiredDocuments.split('\n').filter(d => d.trim()),
        minAge: formData.minAge ? parseInt(formData.minAge) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
        maxIncome: formData.maxIncome ? parseFloat(formData.maxIncome) : null,
        applicationDeadline: formData.applicationDeadline || null
      };

      if (editingScheme) {
        await updateScheme(editingScheme.id, schemeData);
        toast.success('Scheme updated successfully!');
      } else {
        await createScheme(schemeData);
        toast.success('Scheme created successfully! All eligible users will be notified via email.');
      }

      resetForm();
      fetchSchemes();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      description: scheme.description,
      shortDescription: scheme.shortDescription || '',
      department: scheme.department || '',
      ministry: scheme.ministry || '',
      officialWebsite: scheme.officialWebsite || '',
      category: scheme.category,
      benefits: scheme.benefits ? scheme.benefits.join('\n') : '',
      minAge: scheme.minAge || '',
      maxAge: scheme.maxAge || '',
      eligibleStates: scheme.eligibleStates ? scheme.eligibleStates.join(', ') : '',
      eligibleGenders: scheme.eligibleGenders ? scheme.eligibleGenders.join(', ') : '',
      maxIncome: scheme.maxIncome || '',
      eligibleCategories: scheme.eligibleCategories ? scheme.eligibleCategories.join(', ') : '',
      eligibleOccupations: scheme.eligibleOccupations ? scheme.eligibleOccupations.join(', ') : '',
      applicationProcess: scheme.applicationProcess || '',
      requiredDocuments: scheme.requiredDocuments ? scheme.requiredDocuments.join('\n') : '',
      applicationDeadline: scheme.applicationDeadline ? scheme.applicationDeadline.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scheme?')) {
      try {
        await deleteScheme(id);
        toast.success('Scheme deleted successfully');
        fetchSchemes();
      } catch (error) {
        toast.error('Failed to delete scheme');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading schemes...</div>;
  }

  return (
    <div>
      <div className="hero" style={{ padding: '2rem' }}>
        <h1>🛡️ Admin Panel</h1>
        <p>Manage government schemes and notify eligible users</p>
      </div>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2>All Schemes ({schemes.length})</h2>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ Add New Scheme'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3>{editingScheme ? 'Edit Scheme' : 'Create New Scheme'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Scheme Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" required />
              </div>

              <div className="form-group">
                <label>Full Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required />
              </div>

              <div className="form-group">
                <label>Benefits (one per line)</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows="4" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ministry</label>
                  <input type="text" name="ministry" value={formData.ministry} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Official Website</label>
                  <input type="url" name="officialWebsite" value={formData.officialWebsite} onChange={handleChange} />
                </div>
              </div>

              <h4 style={{ marginTop: '1.5rem', color: 'var(--gov-primary)' }}>Eligibility Criteria</h4>

              <div className="form-row">
                <div className="form-group">
                  <label>Minimum Age</label>
                  <input type="number" name="minAge" value={formData.minAge} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Maximum Age</label>
                  <input type="number" name="maxAge" value={formData.maxAge} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Max Annual Income (₹)</label>
                  <input type="number" name="maxIncome" value={formData.maxIncome} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Application Deadline</label>
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Eligible States (comma-separated, e.g., All or Karnataka, Tamil Nadu)</label>
                <input type="text" name="eligibleStates" value={formData.eligibleStates} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Eligible Genders (comma-separated, e.g., All or Male, Female)</label>
                <input type="text" name="eligibleGenders" value={formData.eligibleGenders} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Eligible Categories (comma-separated, e.g., All or SC, ST, OBC)</label>
                <input type="text" name="eligibleCategories" value={formData.eligibleCategories} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Eligible Occupations (comma-separated, leave empty for all)</label>
                <input type="text" name="eligibleOccupations" value={formData.eligibleOccupations} onChange={handleChange} placeholder="e.g., Farmer, Student" />
              </div>

              <div className="form-group">
                <label>Application Process</label>
                <textarea name="applicationProcess" value={formData.applicationProcess} onChange={handleChange} rows="3" />
              </div>

              <div className="form-group">
                <label>Required Documents (one per line)</label>
                <textarea name="requiredDocuments" value={formData.requiredDocuments} onChange={handleChange} rows="4" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                  {editingScheme ? 'Update Scheme' : 'Create Scheme'}
                </button>
                <button type="button" onClick={resetForm} className="btn btn-danger" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="schemes-grid">
          {schemes.map(scheme => (
            <div key={scheme.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{scheme.name}</h3>
                <span className="badge badge-primary">{scheme.category}</span>
              </div>
              <div className="card-body">
                <p>{scheme.shortDescription?.substring(0, 100)}...</p>
              </div>
              <div className="card-footer">
                <button onClick={() => handleEdit(scheme)} className="btn btn-primary">
                  Edit
                </button>
                <button onClick={() => handleDelete(scheme.id)} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
