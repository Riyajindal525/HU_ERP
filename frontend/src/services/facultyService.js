import api from './api';

export const facultyService = {
  getAll: async (filters) => {
    const response = await api.get('/faculty', { params: filters });
    return response.data;
  },

  getAllFaculty: async (filters) => {
    const response = await api.get('/faculty', { params: filters });
    return response.data;
  },

  getFacultyById: async (id) => {
    const response = await api.get(`/faculty/${id}`);
    return response.data;
  },

  updateFaculty: async (id, data) => {
    const response = await api.put(`/faculty/${id}`, data);
    return response.data;
  },

  deleteFaculty: async (id) => {
    const response = await api.delete(`/faculty/${id}`);
    return response.data;
  },
};

export default facultyService;
