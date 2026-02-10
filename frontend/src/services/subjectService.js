import api from './api';

export const subjectService = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  assignFaculty: (id, data) => api.post(`/subjects/${id}/assign-faculty`, data),
  unassignFaculty: (id, facultyId) => api.delete(`/subjects/${id}/unassign-faculty/${facultyId}`),
};
