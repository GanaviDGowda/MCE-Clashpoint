import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Interceptor to add token to requests
  api.interceptors.request.use(
    (config) => {
      console.log("Config object:", config);
      console.log("Config headers:", config.headers);
      
      const token = localStorage.getItem('token');
      console.log("Token found:", token);
  
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Authorization header set:", config.headers['Authorization']);
      }
      return config;
    },
    (error) => {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );
  export default api;
  