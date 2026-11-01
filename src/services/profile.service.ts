import api from './api';

export const profileService = {
  async getProfile() {
    const response = await api.get('/doctor/profile');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.patch('/doctor/profile', data);
    return response.data;
  },
};