import api from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const prescriptionService = {
  async getPrescriptions(searchQuery = '') {
    const response = await api.get(`/doctor/prescriptions${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async deletePrescription(id: string) {
    const response = await api.delete(`/doctor/prescriptions/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getMyPrescriptions() {
    const response = await api.get('/patient/prescriptions', {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async createPrescription(data: any) {
    const response = await api.post('/doctor/prescriptions', data, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getPrescriptionById(id: string) {
    const response = await api.get(`/patient/prescriptions/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};  