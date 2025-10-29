import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Set error message for login page
        localStorage.setItem('authError', 'Your session has expired or you are not authorized. Please login again.');
        
        // Redirect to login
        window.location.href = '/login';
      }
      
      // 404 Not Found - redirect to 404 page
      if (error.response.status === 404 || error.response.status === 400) {
        window.location.href = '/404';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
