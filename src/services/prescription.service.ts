import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getToken = () => localStorage.getItem('token');

export const prescriptionService = {
  async getMyPrescriptions() {
    const token = getToken();
    // Update this URL to match your NestJS Controller route prefix
    const response = await axios.get(`${API_URL}/patient/prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getPrescriptionById(id: string) {
    const token = getToken();
    const response = await axios.get(`${API_URL}/patient/prescriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};