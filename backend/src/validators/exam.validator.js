import { z } from 'zod';

export const createExamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Exam name is required'),
    type: z.enum(['MID_TERM', 'END_TERM', 'INTERNAL', 'ASSIGNMENT', 'QUIZ']),
    subject: z.string().min(1, 'Subject ID is required'),
    course: z.string().min(1, 'Course ID is required'),
    semester: z.number().int().min(1).max(12),
    date: z.string().datetime().or(z.date()),
    duration: z.number().int().min(1),
    totalMarks: z.number().min(1),
    passingMarks: z.number().min(0),
    venue: z.string().optional(),
    instructions: z.string().optional(),
  }).refine((data) => data.passingMarks <= data.totalMarks, {
    message: 'Passing marks cannot exceed total marks',
    path: ['passingMarks'],
  }),
});

export const updateExamSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['MID_TERM', 'END_TERM', 'INTERNAL', 'ASSIGNMENT', 'QUIZ']).optional(),
    date: z.string().datetime().or(z.date()).optional(),
    duration: z.number().int().min(1).optional(),
    totalMarks: z.number().min(1).optional(),
    passingMarks: z.number().min(0).optional(),
    venue: z.string().optional(),
    instructions: z.string().optional(),
    status: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  }),
});
