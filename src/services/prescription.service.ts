import api from './api';

export const prescriptionService = {
  async getPrescriptions(searchQuery = "") {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.get(`/doctor/prescriptions${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },

  async createPrescription(data: any) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.post('/doctor/prescriptions', data, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },

  async deletePrescription(id: string) {
    const response = await api.delete(`/doctor/prescriptions/${id}`);
    return response.data;
  },
};