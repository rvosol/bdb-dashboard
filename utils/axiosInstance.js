import axios from 'axios';







const BACKEND_URL = 'https://bdb-staging-api.aisk.chat/api'



const axiosInstance = axios.create({
  baseURL: BACKEND_URL, // Replace with your API's base URL
});

// Interceptor to include JWT in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
