import api from './api';

export const attendanceService = {
  markAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  bulkMarkAttendance: async (data) => {
    const response = await api.post('/attendance/bulk', data);
    return response.data;
  },

  getAttendance: async (filters) => {
    const response = await api.get('/attendance', { params: filters });
    return response.data;
  },

  getAttendancePercentage: async (studentId, subjectId) => {
    const response = await api.get(`/attendance/percentage/${studentId}/${subjectId}`);
    return response.data;
  },

  getStudentAttendanceSummary: async (studentId) => {
    const response = await api.get(`/attendance/summary/${studentId}`);
    return response.data;
  },

  deleteAttendance: async (id) => {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  },
};

export default attendanceService;
