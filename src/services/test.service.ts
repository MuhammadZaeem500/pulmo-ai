import api from './api';

export const testService = {
  async getTests(searchQuery = "") {
    const response = await api.get(`/doctor/tests${searchQuery ? `?search=${searchQuery}` : ''}`);
    return response.data;
  },

  async createTest(data: any) {
    const response = await api.post('/doctor/tests', data);
    return response.data;
  },

  async deleteTest(id: string) {
    const response = await api.delete(`/doctor/tests/${id}`);
    return response.data;
  },
};