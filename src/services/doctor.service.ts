// src/services/doctor.service.ts
import api from './api';

export const doctorService = {
  async getPatients(searchQuery = "") {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.get(`/doctor/patients${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },
};

export const doctorPortalService = {
  async getProfile() {
    const response = await api.get('/doctor/profile');
    return response.data;
  },
}; // ✅ Closed correctly

export const doctorDashboardService = {
  async getDashboardData() {
    const response = await api.get("/doctor/dashboard");
    return response.data;
  },
};