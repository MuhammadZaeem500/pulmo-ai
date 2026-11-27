import api from './api';

export const settingsService = {
  async getPreferences() {
    try {
      const response = await api.get('/patient/settings/preferences');
      return response.data.data;
    } catch (error: any) {
      console.error('Failed to fetch preferences:', error);
      throw {
        message: error.response?.data?.message || 'Failed to load preferences',
        statusCode: error.response?.status || 500,
      };
    }
  },

  async updatePreferences(prefs: {
    emailNotifications?: boolean;
    appointmentReminders?: boolean;
    healthTips?: boolean;
    language?: string;
    timeZone?: string;
    darkMode?: boolean;
  }) {
    try {
      const response = await api.patch('/patient/settings/preferences', prefs);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update preferences:', error);
      throw {
        message: error.response?.data?.message || 'Failed to save preferences',
        statusCode: error.response?.status || 500,
      };
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    try {
      const response = await api.post('/patient/settings/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to change password:', error);
      throw {
        message: error.response?.data?.message || 'Failed to change password',
        statusCode: error.response?.status || 500,
      };
    }
  },

  async deleteAccount() {
    try {
      const response = await api.delete('/patient/settings/account');
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      throw {
        message: error.response?.data?.message || 'Failed to delete account',
        statusCode: error.response?.status || 500,
      };
    }
  },
};
