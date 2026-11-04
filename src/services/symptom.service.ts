import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getToken = () => {
  return localStorage.getItem('token');
};

export const symptomService = {
  async getAssessments() {
    const token = getToken();
    const response = await axios.get(`${API_URL}/patient/symptoms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // <-- Removed the second .data
  },

  async createAssessment(dto: any) {
    const token = getToken();
    const response = await axios.post(`${API_URL}/patient/symptoms`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // <-- Removed the second .data
  },

  async deleteAssessment(id: string) {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/patient/symptoms/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};