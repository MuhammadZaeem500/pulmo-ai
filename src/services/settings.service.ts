import api from './api';

export const settingsService = {
  async getPreferences() {
    const response = await api.get('/patient/settings/preferences');
    return response.data.data; // { emailNotifications, appointmentReminders, healthTips, language, timeZone, darkMode }
  },

  async updatePreferences(prefs: {
    emailNotifications?: boolean;
    appointmentReminders?: boolean;
    healthTips?: boolean;
    language?: string;
    timeZone?: string;
    darkMode?: boolean;
  }) {
    const response = await api.patch('/patient/settings/preferences', prefs);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post('/patient/settings/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  async deleteAccount() {
    const response = await api.delete('/patient/settings/account');
    return response.data;
  },
};
