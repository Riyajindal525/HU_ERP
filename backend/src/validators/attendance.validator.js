import { z } from 'zod';

export const markAttendanceSchema = z.object({
  body: z.object({
    student: z.string().min(1, 'Student ID is required'),
    subject: z.string().min(1, 'Subject ID is required'),
    date: z.string().or(z.date()),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE']),
    session: z.enum(['MORNING', 'AFTERNOON', 'EVENING']).optional(),
    remarks: z.string().optional(),
  }),
});

export const bulkAttendanceSchema = z.object({
  body: z.object({
    subject: z.string().min(1, 'Subject ID is required'),
    date: z.string().or(z.date()),
    session: z.enum(['MORNING', 'AFTERNOON', 'EVENING']).optional(),
    attendanceRecords: z.array(
      z.object({
        student: z.string().min(1, 'Student ID is required'),
        status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE']),
        remarks: z.string().optional(),
      })
    ).min(1, 'At least one attendance record is required'),
  }),
});

export const getAttendanceSchema = z.object({
  query: z.object({
    student: z.string().optional(),
    subject: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'ON_LEAVE']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
