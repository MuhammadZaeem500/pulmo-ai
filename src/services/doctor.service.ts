import api from './api';

// Helper to get token safely
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const doctorService = {
  async getPatients(searchQuery = "") {
    const response = await api.get(`/doctor/patients${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const doctorPortalService = {
  async getProfile() {
    const response = await api.get('/doctor/profile', {
      headers: getAuthHeader(), // Added auth headers here
    });
    return response.data;
  },
};  

export const doctorDashboardService = {
  async getDashboardData() {
    const response = await api.get("/doctor/dashboard", {
      headers: getAuthHeader(), // Added auth headers here
    });
    return response.data;
  },

  
};