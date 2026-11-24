import api from './api';

export const medicalRecordsService = {
  async getMyRecords() {
    const response = await api.get('/medical-records/my-records');
    return response.data;
  },

  // Method to fetch complete unified history
  async getCompleteHistory() {
    const response = await api.get('/medical-records/complete-history');
    return response.data;
  },

  async createRecord(dto: any) {
    const response = await api.post('/medical-records/intake', dto);
    return response.data;
  },

  async updateRecord(id: string, dto: any) {
    const response = await api.patch(`/medical-records/records/${id}`, dto);
    return response.data;
  },

  async deleteRecord(id: string) {
    const response = await api.delete(`/medical-records/records/${id}`);
    return response.data;
  },
};