import api from './api';

export const bloodService = {
  getAvailableBlood: (bloodGroup, component) => 
    api.get(`/blood/available/${bloodGroup}`, { params: { component } }),
  getInventory: (params) => api.get('/blood/inventory', { params }),
  addBloodBag: (data) => api.post('/blood', data),
  updateBloodBag: (id, data) => api.put(`/blood/${id}`, data),
  updateTestResults: (id, data) => api.put(`/blood/${id}/tests`, data),
  updateStatus: (id, status) => api.put(`/blood/${id}/status`, { status }),
  getExpiringBags: () => api.get('/blood/expiring/alert'),
  getSummary: () => api.get('/blood/summary/stats')
};
