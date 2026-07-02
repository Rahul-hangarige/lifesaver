import api from './api';

export const requestService = {
  createRequest: (data) => api.post('/requests', data),
  getMyRequests: (params) => api.get('/requests/my', { params }),
  getAllRequests: (params) => api.get('/requests', { params }),
  getRequestById: (id) => api.get(`/requests/${id}`),
  assignBlood: (id, bloodBagIds) => api.put(`/requests/${id}/assign`, { bloodBagIds }),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status })
};
