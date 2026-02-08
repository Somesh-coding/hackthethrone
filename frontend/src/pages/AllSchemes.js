import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllSchemes } from '../services/api';
import './AllSchemes.css';

const AllSchemes = () => {
  const [allSchemes, setAllSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedOccupation, setSelectedOccupation] = useState('All');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [maxIncome, setMaxIncome] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Education', 'Health', 'Agriculture', 'Housing', 'Business', 'Social Welfare', 'Employment'];
  const states = ['All', 'Andhra Pradesh', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Rajasthan', 'Kerala', 'Haryana'];
  const genders = ['All', 'Male', 'Female', 'Other'];
  const occupations = ['All', 'Farmer', 'Student', 'Government Employee', 'Private Employee', 'Self Employed', 'Business Owner', 'Unemployed'];

  useEffect(() => {
    fetchAllSchemes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allSchemes, searchTerm, selectedCategory, selectedState, selectedGender, selectedOccupation, minAge, maxAge, maxIncome]);

  const fetchAllSchemes = async () => {
    try {
      const response = await getAllSchemes();
      setAllSchemes(response.data);
      setFilteredSchemes(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch schemes');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allSchemes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    // State filter
    if (selectedState !== 'All') {
      filtered = filtered.filter(scheme =>
        scheme.eligibleStates.includes('All') ||
        scheme.eligibleStates.includes(selectedState)
      );
    }

    // Gender filter
    if (selectedGender !== 'All') {
      filtered = filtered.filter(scheme =>
        scheme.eligibleGenders.includes('All') ||
        scheme.eligibleGenders.includes(selectedGender)
      );
    }

    // Occupation filter
    if (selectedOccupation !== 'All') {
      filtered = filtered.filter(scheme =>
        !scheme.eligibleOccupations || 
        scheme.eligibleOccupations.length === 0 ||
        scheme.eligibleOccupations.includes(selectedOccupation)
      );
    }

    // Age filter - FIX: Check if user's age is within scheme's range
    if (minAge) {
      filtered = filtered.filter(scheme =>
        !scheme.maxAge || parseInt(minAge) <= scheme.maxAge
      );
    }
    if (maxAge) {
      filtered = filtered.filter(scheme =>
        !scheme.minAge || parseInt(maxAge) >= scheme.minAge
      );
    }

    // Income filter - FIX: Check if user's income is below scheme's max
    if (maxIncome) {
      filtered = filtered.filter(scheme =>
        !scheme.maxIncome || parseFloat(maxIncome) <= scheme.maxIncome
      );
    }

    setFilteredSchemes(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedState('All');
    setSelectedGender('All');
    setSelectedOccupation('All');
    setMinAge('');
    setMaxAge('');
    setMaxIncome('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading schemes...</p>
      </div>
    );
  }

  return (
    <div className="all-schemes-clean">
      {/* Header */}
      <div className="schemes-header-clean">
        <h1>Browse All Government Schemes</h1>
        <p>Explore {allSchemes.length} schemes available across India</p>
      </div>

      <div className="schemes-container-clean">
        {/* Search Bar */}
        <div className="search-section-clean">
          <input
            type="text"
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-clean"
          />
          <button 
            className="filter-toggle-clean"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="filters-panel-clean">
            <div className="filters-header-clean">
              <h3>Advanced Filters</h3>
              <button className="reset-btn-clean" onClick={resetFilters}>
                Reset All
              </button>
            </div>
            
            <div className="filters-grid-clean">
              {/* Category */}
              <div className="filter-group-clean">
                <label>Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="filter-group-clean">
                <label>State</label>
                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div className="filter-group-clean">
                <label>Gender</label>
                <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Occupation */}
              <div className="filter-group-clean">
                <label>Occupation</label>
                <select value={selectedOccupation} onChange={(e) => setSelectedOccupation(e.target.value)}>
                  {occupations.map(occ => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>
              </div>

              {/* Age Range */}
              <div className="filter-group-clean">
                <label>Your Age (Min)</label>
                <input
                  type="number"
                  placeholder="Enter your minimum age"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  min="0"
                  max="120"
                />
              </div>

              <div className="filter-group-clean">
                <label>Your Age (Max)</label>
                <input
                  type="number"
                  placeholder="Enter your maximum age"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  min="0"
                  max="120"
                />
              </div>

              {/* Income */}
              <div className="filter-group-clean">
                <label>Your Annual Income (₹)</label>
                <input
                  type="number"
                  placeholder="Enter your annual income"
                  value={maxIncome}
                  onChange={(e) => setMaxIncome(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="results-header-clean">
          <h2>
            {filteredSchemes.length === allSchemes.length
              ? `All Schemes (${allSchemes.length})`
              : `Showing ${filteredSchemes.length} of ${allSchemes.length} schemes`}
          </h2>
        </div>

        {/* Schemes Display */}
        {filteredSchemes.length === 0 ? (
          <div className="no-results-clean">
            <h3>No schemes found</h3>
            <p>Try adjusting your filters</p>
            <button className="btn-reset-clean" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="schemes-grid-clean">
            {filteredSchemes.map(scheme => (
              <div key={scheme.id} className="scheme-card-clean">
                <div className="scheme-category-clean">{scheme.category}</div>
                <h3 className="scheme-title-clean">{scheme.name}</h3>
                <p className="scheme-desc-clean">
                  {scheme.shortDescription || scheme.description.substring(0, 120)}...
                </p>

                {scheme.benefits && scheme.benefits.length > 0 && (
                  <div className="benefits-clean">
                    <strong>Benefits:</strong>
                    <ul>
                      {scheme.benefits.slice(0, 2).map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="scheme-meta-clean">
                  {scheme.minAge && (
                    <span>Age: {scheme.minAge}{scheme.maxAge ? `-${scheme.maxAge}` : '+'}</span>
                  )}
                  {scheme.maxIncome && (
                    <span>Income ≤ ₹{scheme.maxIncome.toLocaleString()}</span>
                  )}
                </div>

                <div className="scheme-footer-clean">
                  <Link to={`/schemes/${scheme.id}`} className="btn-view-clean">
                    View Details
                  </Link>
                  {scheme.officialWebsite && (
                    <a
                      href={scheme.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-apply-clean"
                    >
                      Apply Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSchemes;
