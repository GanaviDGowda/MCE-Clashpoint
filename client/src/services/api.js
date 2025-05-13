import axios from 'axios';

// Create an axios instance with base URL and common configurations
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(response => {
  return response;
}, error => {
  // Centralized error handling
  const errorMsg = error.response?.data?.error || 'An unexpected error occurred';
  console.error('API Error:', errorMsg);
  
  // Handle auth errors
  if (error.response?.status === 401) {
    // Redirect to login or refresh token
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return Promise.reject(error);
});

export default api;