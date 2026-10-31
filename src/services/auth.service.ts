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
async signupDoctor(data: any) {
    const payload = {
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      licenseNumber: data.pmdcNumber,
      specialty: data.specialty, // Explicitly mapped
      specialization: data.specialty, // Maps to backend DTO key just in case
      hospital: data.hospital,
      qualifications: data.qualifications || "",
      experience: Number(data.experience) || 0,
    };

    const response = await api.post('/auth/doctor/sign-up', payload);
    return response.data;
  },

  
}