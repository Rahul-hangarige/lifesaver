import api from './api';

export const campaignService = {
  createCampaign: (data) => api.post('/campaigns', data),
  getCampaigns: (params) => api.get('/campaigns', { params }),
  getCampaignById: (id) => api.get(`/campaigns/${id}`),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}`),
  getActiveCampaigns: () => api.get('/campaigns/active/list')
};
