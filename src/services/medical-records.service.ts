import api from './api';

export const medicalRecordsService = {
  async getMyRecords() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    const response = await api.get('/medical-records/my-records', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  },
  async createRecord(recordData: any) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.post('/medical-records', recordData, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },
};