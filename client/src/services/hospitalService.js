import api from './api';

export const hospitalService = {
  getProfile: () => api.get('/hospitals/profile'),
  updateProfile: (data) => api.put('/hospitals/profile', data),
  getHospitals: (params) => api.get('/hospitals', { params }),
  getHospitalById: (id) => api.get(`/hospitals/${id}`),
  approveHospital: (id) => api.put(`/hospitals/${id}/approve`),
  getNearbyHospitals: (coordinates) => api.get(`/hospitals/nearby/${coordinates}`)
};
