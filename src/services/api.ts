import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Update if your backend runs on a different port/url
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or whatever key you use for the auth token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;