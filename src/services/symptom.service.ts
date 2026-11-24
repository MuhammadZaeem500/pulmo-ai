import api from './api';

export const symptomService = {
  async getAssessments() {
    const response = await api.get('/patient/symptoms');
    return response.data; 
  },

  async createAssessment(dto: any) {
    const response = await api.post('/patient/symptoms', dto);
    return response.data;
  },

  async deleteAssessment(id: string) {
    const response = await api.delete(`/patient/symptoms/${id}`);
    return response.data;
  },
};