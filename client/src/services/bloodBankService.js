import api from './api';

export const bloodBankService = {
  getProfile: () => api.get('/bloodbanks/profile'),
  updateProfile: (data) => api.put('/bloodbanks/profile', data),
  getBloodBanks: (params) => api.get('/bloodbanks', { params }),
  getApprovedBloodBanks: () => api.get('/bloodbanks/approved/list'),
  getBloodBankById: (id) => api.get(`/bloodbanks/${id}`),
  approveBloodBank: (id) => api.put(`/bloodbanks/${id}/approve`),
  getNearbyBloodBanks: (coordinates) => api.get(`/bloodbanks/nearby/${coordinates}`)
};
