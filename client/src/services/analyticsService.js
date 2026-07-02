import api from './api';

export const analyticsService = {
  getOverview: () => api.get('/analytics/overview'),
  getMonthlyDonations: () => api.get('/analytics/donations/monthly'),
  getBloodDistribution: () => api.get('/analytics/blood/distribution'),
  getBloodBankStats: () => api.get('/analytics/bloodbank/stats'),
  getCampaignPerformance: () => api.get('/analytics/campaigns/performance'),
  getDonorStats: () => api.get('/analytics/donor/stats')
};
