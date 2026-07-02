import api from './api';

export const certificateService = {
  generateCertificate: (data) => api.post('/certificates', data),
  getMyCertificates: () => api.get('/certificates/my'),
  getCertificateById: (id) => api.get(`/certificates/${id}`),
  verifyCertificate: (certificateNumber) => api.get(`/certificates/verify/${certificateNumber}`),
  downloadCertificate: (id) => api.get(`/certificates/${id}/download`, { responseType: 'blob' })
};
