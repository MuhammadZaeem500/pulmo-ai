import api from './api';

const getAuthHeader = () => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const consultationService = {
  async getNotes(searchQuery = '') {
    const query = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
    const response = await api.get(`/doctor/consultation-notes${query}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async createNote(noteData: any) {
    const response = await api.post('/doctor/consultation-notes', noteData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async updateNote(id: string, noteData: any) {
    const response = await api.patch(`/doctor/consultation-notes/${id}`, noteData, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async deleteNote(id: string) {
    const response = await api.delete(`/doctor/consultation-notes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};