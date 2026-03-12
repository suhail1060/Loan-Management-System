import axios from 'axios';

// Base API URL - will use environment variable or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// User API calls
export const userAPI = {
  getAll: () => api.get('/api/users'),
};

// Loan API calls
export const loanAPI = {
  getAll: () => api.get('/api/loans'),
  getById: (id) => api.get(`/api/loans/${id}`),
  create: (data) => api.post('/api/loans', data),
  updateStatus: (id, status) => api.put(`/api/loans/${id}/status`, { status }),
};

export default api;