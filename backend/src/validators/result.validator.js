import { z } from 'zod';

export const submitResultSchema = z.object({
  body: z.object({
    student: z.string().min(1, 'Student ID is required'),
    exam: z.string().min(1, 'Exam ID is required'),
    subject: z.string().min(1, 'Subject ID is required'),
    marksObtained: z.number().min(0),
    totalMarks: z.number().min(1),
    remarks: z.string().optional(),
  }).refine((data) => data.marksObtained <= data.totalMarks, {
    message: 'Marks obtained cannot exceed total marks',
    path: ['marksObtained'],
  }),
});

export const bulkResultSchema = z.object({
  body: z.object({
    exam: z.string().min(1, 'Exam ID is required'),
    results: z.array(
      z.object({
        student: z.string().min(1, 'Student ID is required'),
        subject: z.string().min(1, 'Subject ID is required'),
        marksObtained: z.number().min(0),
        totalMarks: z.number().min(1),
        remarks: z.string().optional(),
      })
    ).min(1, 'At least one result is required'),
  }),
});

export const publishResultSchema = z.object({
  body: z.object({
    examId: z.string().min(1, 'Exam ID is required'),
  }),
});
