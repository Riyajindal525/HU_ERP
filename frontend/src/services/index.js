import api from './api';
import { subjectService } from './subjectService';

export { subjectService };

export const authService = {
  // Register
  
  register: async (data) => {
    console.log("data",data)
    return api.post('/auth/register', data);
  },

  // Login
  login: async (email, password) => {
    // The original login method had localStorage logic.
    // The instruction implies a simplification, but to maintain functionality,
    // I'll keep the async/await and localStorage logic,
    // and add the new methods as separate entries.
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response;
  },

  // Send OTP
  sendOtp: async (email) => {
    return api.post('/auth/send-otp', { email });
  },

  // Login with OTP
  loginWithOtp: async (email, otp) => {
    const response = await api.post('/auth/login-with-otp', { email, otp });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    return response;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },

  // Refresh token
  refreshToken: async () => {
    return api.post('/auth/refresh');
  },

  // Forgot password
  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token, password) => {
    return api.post('/auth/reset-password', { token, password });
  },

  // Verify email
  verifyEmail: async (token) => {
    return api.post('/auth/verify-email', { token });
  },

  // Change password
  changePassword: async (data) => {
    return api.post('/auth/change-password', data);
  },

  // Upload profile photo
  uploadProfilePhoto: async (formData) => {
    return api.post('/auth/upload-profile-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const studentService = {
  // Get all students
  getAll: async (params) => {
    return api.get('/students', { params });
  },

  // Get student by ID
  getById: async (id) => {
    return api.get(`/students/${id}`);
  },

  // Create student
  create: async (data) => {
    // Ensure password is at least 8 characters
    if (!data.password || data.password.length < 8) {
      data.password = 'Student@123'; // Default strong password
    }
    console.log('📤 Sending student data to API:', {
      ...data,
      password: '***' + (data.password?.slice(-3) || '')
    });
    return api.post('/students', data);
  },

  // Update student
  update: async (id, data) => {
    return api.put(`/students/${id}`, data);
  },

  // Delete student
  delete: async (id) => {
    return api.delete(`/students/${id}`);
  },

  // Get attendance
  getAttendance: async (id, params) => {
    return api.get(`/students/${id}/attendance`, { params });
  },

  // Get results
  getResults: async (id, params) => {
    return api.get(`/students/${id}/results`, { params });
  },

  // Get fees
  getFees: async (id) => {
    return api.get(`/students/${id}/fees`);
  },
};

export const facultyService = {
  getAll: async (params) => {
    return api.get('/faculty', { params });
  },

  getById: async (id) => {
    return api.get(`/faculty/${id}`);
  },

  create: async (data) => {
    return api.post('/faculty', data);
  },

  update: async (id, data) => {
    return api.put(`/faculty/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/faculty/${id}`);
  },
};

export const departmentService = {
  getAll: async () => {
    return api.get('/departments');
  },

  getById: async (id) => {
    return api.get(`/departments/${id}`);
  },

  create: async (data) => {
    return api.post('/departments', data);
  },

  update: async (id, data) => {
    return api.put(`/departments/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/departments/${id}`);
  },

  getStatistics: async (id) => {
    return api.get(`/departments/${id}/statistics`);
  },
};

export const courseService = {
  getAll: async (params) => {
    return api.get('/courses', { params });
  },

  getById: async (id) => {
    return api.get(`/courses/${id}`);
  },

  create: async (data) => {
    return api.post('/courses', data);
  },

  update: async (id, data) => {
    return api.put(`/courses/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/courses/${id}`);
  },
};

export const paymentService = {
  getAll: async (params) => {
    return api.get('/payments', { params });
  },

  create: async (data) => {
    return api.post('/payments', data);
  },
};


export const feeService = {
  getAll: async () => {
    return api.get('/fees');
  },
};

export const dashboardService = {
  getStats: async () => {
    return api.get('/dashboard/stats');
  },
};

