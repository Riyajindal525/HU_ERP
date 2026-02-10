// User Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  FACULTY: 'FACULTY',
  STUDENT: 'STUDENT',
};

// Exam Types
export const EXAM_TYPES = {
  MID_TERM: 'MID_TERM',
  END_TERM: 'END_TERM',
  INTERNAL: 'INTERNAL',
  ASSIGNMENT: 'ASSIGNMENT',
  QUIZ: 'QUIZ',
};

// Exam Status
export const EXAM_STATUS = {
  SCHEDULED: 'SCHEDULED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  LATE: 'LATE',
  ON_LEAVE: 'ON_LEAVE',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: 'ANNOUNCEMENT',
  ALERT: 'ALERT',
  REMINDER: 'REMINDER',
  MESSAGE: 'MESSAGE',
  SYSTEM: 'SYSTEM',
};

// Notification Categories
export const NOTIFICATION_CATEGORIES = {
  ACADEMIC: 'ACADEMIC',
  EXAM: 'EXAM',
  FEE: 'FEE',
  ATTENDANCE: 'ATTENDANCE',
  GENERAL: 'GENERAL',
};

// Notification Priority
export const NOTIFICATION_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
  NET_BANKING: 'NET_BANKING',
  CHEQUE: 'CHEQUE',
};

// Gender
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

// Guardian Relations
export const GUARDIAN_RELATIONS = {
  FATHER: 'FATHER',
  MOTHER: 'MOTHER',
  GUARDIAN: 'GUARDIAN',
  OTHER: 'OTHER',
};

// Grade Points
export const GRADE_POINTS = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0,
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  STUDENTS: '/students',
  FACULTY: '/faculty',
  COURSES: '/courses',
  SUBJECTS: '/subjects',
  DEPARTMENTS: '/departments',
  ATTENDANCE: '/attendance',
  EXAMS: '/exams',
  RESULTS: '/results',
  FEES: '/fees',
  PAYMENTS: '/payments',
  NOTIFICATIONS: '/notifications',
  DASHBOARD: '/dashboard',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'PPP',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'PPP p',
};

export default {
  ROLES,
  EXAM_TYPES,
  EXAM_STATUS,
  ATTENDANCE_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITY,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  GENDER,
  GUARDIAN_RELATIONS,
  GRADE_POINTS,
  API_ENDPOINTS,
  PAGINATION,
  DATE_FORMATS,
};
