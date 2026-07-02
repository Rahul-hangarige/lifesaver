import api from './api';

export const donationService = {
  createDonation: (data) => api.post('/donations', data),
  getDonations: (params) => api.get('/donations', { params }),
  getDonationById: (id) => api.get(`/donations/${id}`),
  getDonationHistory: (email) => api.get(`/donations/history/${email}`),
  generateCertificate: (id) => api.post(`/donations/${id}/certificate`),
  getStats: () => api.get('/donations/stats/summary')
};
