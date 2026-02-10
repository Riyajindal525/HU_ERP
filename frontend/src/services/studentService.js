import api from './api';

export const studentService = {
  getAllStudents: async (filters) => {
    const response = await api.get('/students', { params: filters });
    return response.data;
  },

  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  updateStudent: async (id, data) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

export default studentService;
