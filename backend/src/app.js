import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { generalLimiter } from './middlewares/rateLimiter.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import facultyRoutes from './routes/faculty.routes.js';
import courseRoutes from './routes/course.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import departmentRoutes from './routes/department.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import feeRoutes from './routes/fee.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import examRoutes from './routes/exam.routes.js';
import resultRoutes from './routes/result.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import libraryRoutes from './routes/library.routes.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const allowedOrigins = [
  'http://localhost:5173',
  'https://hu-erp.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / curl
      if (!origin) return callback(null, true);

      // Allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // 🔑 Allow ALL Vercel preview deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      console.error('❌ CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🔑 Preflight fix (VERY IMPORTANT)
app.options('*', cors());


// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));

// Debug middleware for registration requests
app.use((req, res, next) => {
  if (req.path === '/api/v1/auth/register' && req.method === 'POST') {
    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('Raw request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
  }
  next();
});

// Request logging (development only)
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

// Rate limiting
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/faculty', facultyRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/exams', examRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/library', libraryRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
