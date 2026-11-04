import api from './api';

export const medicalRecordsService = {
  async getMyRecords() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    const response = await api.get('/medical-records/records', { // <--- Changed from '/my-records' to '/records'
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  },

  async createRecord(recordData: any) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.post('/medical-records/intake', recordData, { // <--- Changed from '/' to '/intake'
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },
};