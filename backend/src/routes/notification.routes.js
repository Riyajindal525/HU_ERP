import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import { createNotificationSchema, markAsReadSchema } from '../validators/notification.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all notifications (Admin only - for management)
router.get('/all', authorize('ADMIN', 'SUPER_ADMIN'), notificationController.getAllNotifications);

// Get user notifications
router.get('/', notificationController.getUserNotifications);

// Get unread count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark notifications as read
router.patch(
  '/mark-read',
  validate(markAsReadSchema),
  notificationController.markAsRead
);

// Mark all as read
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

// Admin delete any notification
router.delete('/admin/:id', authorize('ADMIN', 'SUPER_ADMIN'), notificationController.adminDeleteNotification);

// Delete all notifications
router.delete('/', notificationController.deleteAllNotifications);

// Create notification (Admin and Super Admin only)
router.post(
  '/',
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(createNotificationSchema),
  notificationController.createNotification
);

// Send bulk notification (Admin and Super Admin only)
router.post(
  '/bulk',
  authorize('ADMIN', 'SUPER_ADMIN'),
  notificationController.sendBulkNotification
);

export default router;
