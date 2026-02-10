import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

class NotificationService {
  async createNotification(notificationData) {
    const { recipient, type, category, title, message, priority, actionUrl, expiresAt } = notificationData;

    // Handle multiple recipients
    if (Array.isArray(recipient)) {
      const notifications = await Promise.all(
        recipient.map(async (recipientId) => {
          const user = await User.findById(recipientId);
          if (!user) {
            logger.warn(`User not found: ${recipientId}`);
            return null;
          }

          return Notification.create({
            recipient: recipientId,
            type,
            category,
            title,
            message,
            priority,
            actionUrl,
            expiresAt,
          });
        })
      );

      const created = notifications.filter(n => n !== null);
      logger.info(`Bulk notifications created: ${created.length}`);
      return created;
    }

    // Single recipient
    const user = await User.findById(recipient);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const notification = await Notification.create(notificationData);
    logger.info(`Notification created for user ${recipient}`);
    
    return notification;
  }

  async getUserNotifications(userId, filters = {}) {
    const { isRead, category, type, page = 1, limit = 20 } = filters;

    const query = { recipient: userId };
    
    if (typeof isRead === 'boolean') query.isRead = isRead;
    if (category) query.category = category;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async getAllNotifications(filters = {}) {
    const { isRead, category, type, page = 1, limit = 50 } = filters;

    const query = {};
    
    if (typeof isRead === 'boolean') query.isRead = isRead;
    if (category) query.category = category;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .populate('recipient', 'firstName lastName email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query),
      Notification.countDocuments({ isRead: false }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    };
  }

  async markAsRead(notificationIds, userId) {
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      throw new ValidationError('Notification IDs must be a non-empty array');
    }

    const result = await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
    
    return {
      message: 'Notifications marked as read',
      count: result.modifiedCount,
    };
  }

  async markAllAsRead(userId) {
    const result = await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    logger.info(`Marked all notifications as read for user ${userId}`);
    
    return {
      message: 'All notifications marked as read',
      count: result.modifiedCount,
    };
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    await notification.deleteOne();
    logger.info(`Notification deleted: ${notificationId}`);
    
    return { message: 'Notification deleted successfully' };
  }

  async adminDeleteNotification(notificationId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    await notification.deleteOne();
    logger.info(`Notification deleted by admin: ${notificationId}`);
    
    return { message: 'Notification deleted successfully' };
  }

  async deleteAllNotifications(userId) {
    const result = await Notification.deleteMany({ recipient: userId });
    
    logger.info(`Deleted all notifications for user ${userId}: ${result.deletedCount}`);
    
    return {
      message: 'All notifications deleted',
      count: result.deletedCount,
    };
  }

  async sendBulkNotification(recipientQuery, notificationData) {
    // Find users based on query (e.g., all students, all faculty, etc.)
    const users = await User.find(recipientQuery).select('_id');
    
    if (users.length === 0) {
      throw new NotFoundError('No users found matching the criteria');
    }

    const recipientIds = users.map(u => u._id);
    
    return this.createNotification({
      ...notificationData,
      recipient: recipientIds,
    });
  }

  async getUnreadCount(userId) {
    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });

    return { unreadCount: count };
  }
}

export default new NotificationService();
