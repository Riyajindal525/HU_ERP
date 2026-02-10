import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    recipient: z.string().min(1, 'Recipient ID is required').or(z.array(z.string())),
    type: z.enum(['ANNOUNCEMENT', 'ALERT', 'REMINDER', 'MESSAGE', 'SYSTEM']),
    category: z.enum(['ACADEMIC', 'EXAM', 'FEE', 'ATTENDANCE', 'GENERAL']).optional(),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    actionUrl: z.string().url().optional(),
    expiresAt: z.string().datetime().or(z.date()).optional(),
  }),
});

export const markAsReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(z.string()).min(1, 'At least one notification ID is required'),
  }),
});
