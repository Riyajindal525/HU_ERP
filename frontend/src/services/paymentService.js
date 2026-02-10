import api from './api';

export const paymentService = {
  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  getAllPayments: async (filters) => {
    const response = await api.get('/payments', { params: filters });
    return response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  verifyPayment: async (id, data) => {
    const response = await api.post(`/payments/${id}/verify`, data);
    return response.data;
  },
};

export default paymentService;
