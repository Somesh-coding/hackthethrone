import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getUserById, updateUser } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const userId = localStorage.getItem('userId');

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const categories = ['General', 'OBC', 'SC', 'ST'];
  const genders = ['Male', 'Female', 'Other'];

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await getUserById(userId);
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch user details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        age: parseInt(user.age),
        state: user.state,
        district: user.district,
        occupation: user.occupation,
        annualIncome: parseFloat(user.annualIncome),
        category: user.category,
        gender: user.gender
      };
      
      await updateUser(userId, updateData);
      toast.success('Profile updated successfully!');
      setEditing(false);
      localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="container"><div className="alert alert-danger">User not found</div></div>;
  }

  return (
    <div className="container">
      <div className="form-container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2>👤 My Profile</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn btn-primary">
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              style={{ backgroundColor: '#f5f5f5' }}
            />
            <small style={{ color: '#666' }}>Email cannot be changed</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <select name="state" value={user.state} onChange={handleChange} disabled={!editing}>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                value={user.district}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                name="occupation"
                value={user.occupation}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div className="form-group">
              <label>Annual Income (₹)</label>
              <input
                type="number"
                name="annualIncome"
                value={user.annualIncome}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={user.category} onChange={handleChange} disabled={!editing}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={user.gender} onChange={handleChange} disabled={!editing}>
                {genders.map(gen => (
                  <option key={gen} value={gen}>{gen}</option>
                ))}
              </select>
            </div>
          </div>

          {editing && (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setEditing(false);
                  fetchUserDetails();
                }} 
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <div className="alert alert-info" style={{ marginTop: '2rem' }}>
          <h3>📧 Email Verification Status</h3>
          <p>
            {user.isEmailVerified ? (
              <span style={{ color: 'var(--gov-success)' }}>✅ Your email is verified</span>
            ) : (
              <span style={{ color: 'var(--gov-danger)' }}>❌ Your email is not verified</span>
            )}
          </p>
        </div>

        <div className="alert alert-info">
          <h3>💡 Why Keep Your Profile Updated?</h3>
          <p>
            Updating your profile ensures you receive accurate scheme recommendations
            and email notifications about new schemes that match your eligibility criteria.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
