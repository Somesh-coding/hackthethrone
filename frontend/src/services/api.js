import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp });
export const resendOtp = (email) => api.post('/auth/resend-otp', { email });

// User APIs
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

// Scheme APIs
export const getAllSchemes = () => api.get('/schemes/public/all');
export const getSchemeById = (id) => api.get(`/schemes/public/${id}`);
export const getEligibleSchemes = (userId) => api.get(`/schemes/eligible/${userId}`);
export const getSchemesByCategory = (category) => api.get(`/schemes/public/category/${category}`);
export const searchSchemes = (query) => api.get(`/schemes/public/search?query=${query}`);

// Admin APIs
export const createScheme = (schemeData) => api.post('/schemes/admin/create', schemeData);
export const updateScheme = (id, schemeData) => api.put(`/schemes/admin/update/${id}`, schemeData);
export const deleteScheme = (id) => api.delete(`/schemes/admin/delete/${id}`);

export default api;
