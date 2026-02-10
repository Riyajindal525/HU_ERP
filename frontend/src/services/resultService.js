import api from './api';

export const resultService = {
  submitResult: async (data) => {
    const response = await api.post('/results', data);
    return response.data;
  },

  bulkSubmitResults: async (data) => {
    const response = await api.post('/results/bulk', data);
    return response.data;
  },

  publishResults: async (examId) => {
    const response = await api.post('/results/publish', { examId });
    return response.data;
  },

  getStudentResults: async (studentId, filters) => {
    const response = await api.get(`/results/student/${studentId}`, {
      params: filters,
    });
    return response.data;
  },

  calculateSGPA: async (studentId, semester) => {
    const response = await api.get(`/results/sgpa/${studentId}/${semester}`);
    return response.data;
  },

  calculateCGPA: async (studentId) => {
    const response = await api.get(`/results/cgpa/${studentId}`);
    return response.data;
  },

  getExamResults: async (examId) => {
    const response = await api.get(`/results/exam/${examId}`);
    return response.data;
  },

  deleteResult: async (id) => {
    const response = await api.delete(`/results/${id}`);
    return response.data;
  },
};

export default resultService;
