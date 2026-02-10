import api from './api';

export const courseService = {
  createCourse: async (data) => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  getAllCourses: async (filters) => {
    const response = await api.get('/courses', { params: filters });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

export default courseService;
