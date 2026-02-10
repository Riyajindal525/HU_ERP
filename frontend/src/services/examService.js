import api from './api';

export const examService = {
  createExam: async (data) => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  getAllExams: async (filters) => {
    const response = await api.get('/exams', { params: filters });
    return response.data;
  },

  getExamById: async (id) => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  getUpcomingExams: async (courseId, semester) => {
    const response = await api.get(`/exams/upcoming/${courseId}`, {
      params: { semester },
    });
    return response.data;
  },

  updateExam: async (id, data) => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  publishExam: async (id) => {
    const response = await api.patch(`/exams/${id}/publish`);
    return response.data;
  },

  deleteExam: async (id) => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};

export default examService;
