import api from './api';

const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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

  async deleteNote(id: string) {
    const response = await api.delete(`/doctor/consultation-notes/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  }
};