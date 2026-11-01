import api from './api';

export const consultationService = {
  async getNotes(searchQuery = "") {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.get(`/doctor/consultation-notes${searchQuery ? `?search=${searchQuery}` : ''}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },

  async createNote(noteData: any) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.post('/doctor/consultation-notes', noteData, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },
  async updateNote(id: string, noteData: any) {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const response = await api.patch(`/doctor/consultation-notes/${id}`, noteData, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    });
    return response.data;
  },
};