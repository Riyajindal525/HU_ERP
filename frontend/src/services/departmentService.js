import api from './api';

const departmentService = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response;
  },

  getById: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await api.post('/departments', data);
    return response;
  },

  update: async (id, data) => {
    const response = await api.put(`/departments/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response;
  },

  getStatistics: async (id) => {
    const response = await api.get(`/departments/${id}/statistics`);
    return response;
  },
};

export default departmentService;
