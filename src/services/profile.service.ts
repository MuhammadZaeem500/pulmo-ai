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

export const patientProfileService = {
  async getProfile() {
    const response = await api.get('/patient/profile');
    return response.data.data;
  },

  async updateProfile(dto: {
    fullName?: string;
    phoneNumber?: string;
    gender?: string;
    address?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
  }) {
    const response = await api.patch('/patient/profile', dto);
    return response.data;
  },
};
