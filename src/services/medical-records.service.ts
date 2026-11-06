import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getToken = () => {
  return localStorage.getItem('token');
};

export const medicalRecordsService = {
  async getMyRecords() {
    const token = getToken();
    const response = await axios.get(`${API_URL}/medical-records/my-records`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // Added method to fetch complete unified history
  async getCompleteHistory() {
    const token = getToken();
    const response = await axios.get(`${API_URL}/medical-records/complete-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createRecord(dto: any) {
    const token = getToken();
    const response = await axios.post(`${API_URL}/medical-records/intake`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async updateRecord(id: string, dto: any) {
    const token = getToken();
    const response = await axios.patch(`${API_URL}/medical-records/records/${id}`, dto, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async deleteRecord(id: string) {
    const token = getToken();
    const response = await axios.delete(`${API_URL}/medical-records/records/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};