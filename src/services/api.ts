import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Update to your backend URL if needed
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Adjust key if your app uses a different name
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;