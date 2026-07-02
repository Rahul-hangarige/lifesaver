import api from './api';

export const donorService = {
  getProfile: () => api.get('/donors/profile'),
  updateProfile: (data) => api.put('/donors/profile', data),
  getDonors: (params) => api.get('/donors', { params }),
  getDonorById: (id) => api.get(`/donors/${id}`),
  updateEligibility: (id, data) => api.put(`/donors/${id}/eligibility`, data),
  getEligibleDonors: (bloodGroup) => api.get(`/donors/eligible/${bloodGroup}`)
};
