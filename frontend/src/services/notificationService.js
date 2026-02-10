import api from './api';

export const notificationService = {
  getUserNotifications: async (filters) => {
    const response = await api.get('/notifications', { params: filters });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (notificationIds) => {
    const response = await api.patch('/notifications/mark-read', {
      notificationIds,
    });
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  deleteAllNotifications: async () => {
    const response = await api.delete('/notifications');
    return response.data;
  },

  createNotification: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  sendBulkNotification: async (data) => {
    const response = await api.post('/notifications/bulk', data);
    return response.data;
  },
};

export default notificationService;
