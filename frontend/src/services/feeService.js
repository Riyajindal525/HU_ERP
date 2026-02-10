import api from './api';

export const feeService = {
  getAllFees: async (filters) => {
    const response = await api.get('/fees', { params: filters });
    return response.data;
  },

  getFeeById: async (id) => {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  },

  createFee: async (data) => {
    const response = await api.post('/fees', data);
    return response.data;
  },

  updateFee: async (id, data) => {
    const response = await api.put(`/fees/${id}`, data);
    return response.data;
  },

  deleteFee: async (id) => {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
  },
};

export default feeService;
