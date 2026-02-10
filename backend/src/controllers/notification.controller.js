import notificationService from '../services/notification.service.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification,
  });
});

export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  const filters = {
    isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
    category: req.query.category,
    type: req.query.type,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 20,
  };

  const result = await notificationService.getUserNotifications(userId, filters);

  res.json({
    success: true,
    data: result,
  });
});

export const getAllNotifications = asyncHandler(async (req, res) => {
  const filters = {
    isRead: req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined,
    category: req.query.category,
    type: req.query.type,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 50,
  };

  const result = await notificationService.getAllNotifications(filters);

  res.json({
    success: true,
    data: result,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { notificationIds } = req.body;

  const result = await notificationService.markAsRead(notificationIds, userId);

  res.json({
    success: true,
    message: result.message,
    data: { count: result.count },
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await notificationService.markAllAsRead(userId);

  res.json({
    success: true,
    message: result.message,
    data: { count: result.count },
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await notificationService.deleteNotification(id, userId);

  res.json({
    success: true,
    message: result.message,
  });
});

export const adminDeleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await notificationService.adminDeleteNotification(id);

  res.json({
    success: true,
    message: result.message,
  });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await notificationService.deleteAllNotifications(userId);

  res.json({
    success: true,
    message: result.message,
    data: { count: result.count },
  });
});

export const sendBulkNotification = asyncHandler(async (req, res) => {
  const { recipientQuery, ...notificationData } = req.body;

  const result = await notificationService.sendBulkNotification(recipientQuery, notificationData);

  res.status(201).json({
    success: true,
    message: 'Bulk notification sent',
    data: result,
  });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await notificationService.getUnreadCount(userId);

  res.json({
    success: true,
    data: result,
  });
});
