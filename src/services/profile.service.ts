import api from './api';

// ── Doctor profile ────────────────────────────────────────────────────────────
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

// ── Patient profile ───────────────────────────────────────────────────────────
export const patientProfileService = {
  async getProfile() {
    const response = await api.get('/patient/profile');
    // Backend returns { message, data: { ...user, patientProfile, summary, recentPrescriptions } }
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
