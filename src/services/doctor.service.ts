import api from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const doctorService = {
  async getPatients(searchQuery = "") {
    const response = await api.get(`/doctor/patients${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const doctorPortalService = {
  async getProfile() {
    const response = await api.get('/doctor/profile', {
      headers: getAuthHeader(), 
    });
    return response.data;
  },
};  

export const doctorDashboardService = {
  async getDashboardData() {
    const response = await api.get("/doctor/dashboard", {
      headers: getAuthHeader(), 
    });
    return response.data;
  },
};

// ─── Doctor Settings Service ─────────────────────────────────────────────────
export const doctorSettingsService = {
  async getProfile() {
    const response = await api.get('/doctor/settings/profile', {
      headers: getAuthHeader(),
    });
    return response.data.data;
  },

  async updateProfile(dto: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    specialty?: string;
  }) {
    const response = await api.patch('/doctor/settings/profile', dto, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post(
      '/doctor/settings/change-password',
      { currentPassword, newPassword },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  async getPreferences() {
    const response = await api.get('/doctor/settings/preferences', {
      headers: getAuthHeader(),
    });
    return response.data.data;
  },

  async updatePreferences(dto: any) {
    const response = await api.patch('/doctor/settings/preferences', dto, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  },
};