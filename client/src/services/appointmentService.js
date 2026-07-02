import api from './api';

export const appointmentService = {
  createAppointment: (data) => api.post('/appointments', data),
  getMyAppointments: (params) => api.get('/appointments/my', { params }),
  getBloodBankAppointments: (params) => api.get('/appointments/bloodbank', { params }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancelAppointment: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (bloodBankId, date) => api.get(`/appointments/slots/${bloodBankId}/${date}`)
};
