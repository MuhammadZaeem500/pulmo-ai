import { api } from './api';

export const authService = {
  async signupPatient(data: any) {
    const response = await api.post('/auth/patient/sign-up', data);
    return response.data;
  },

  async login(data: any) {
    const response = await api.post('/auth/sign-in', data);
    if (response.data.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response.data;
  },

  async signupAdmin(data: any) {
    const response = await api.post('/auth/admin/sign-up', data);
    return response.data;
  },
};