import api from './api';

export const appointmentService = {
  async getAppointments() {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  async updateStatus(id: string, status: string) {
    const response = await api.patch(`/doctor/appointments/${id}/status`, { status });
    return response.data;
  },
};