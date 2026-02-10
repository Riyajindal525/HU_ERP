# Haridwar University ERP Portal

A complete, production-ready MERN stack ERP system for university management with enterprise-grade architecture, security, and scalability.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, Tailwind CSS, Redux Toolkit, React Query
- **Backend**: Node.js, Express.js, MongoDB, Redis
- **Authentication**: JWT with refresh tokens, RBAC
- **Security**: Helmet, CORS, Rate Limiting, Input Validation (Zod)
- **Deployment**: Docker, Docker Compose, Nginx

### Project Structure

```
haridwar-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (DB, Redis, Env)
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Zod validation schemas
│   │   └── app.js           # Express app
│   ├── server.js            # Server entry point
│   └── package.json
├── frontend/
│   └── (React application)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 7.x
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - MongoDB connection string
   - Redis URL
   - JWT secrets (change the defaults!)
   - SMTP credentials for email
   - Frontend URL

4. **Start MongoDB and Redis**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

5. **Run the backend**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

6. **Verify the server is running**
   ```bash
   curl http://localhost:5000/health
   ```

### Frontend Setup

*(To be added)*

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Password123",
  "role": "STUDENT",
  "profileData": {
    "enrollmentNumber": "HU2024001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2005-01-15",
    "gender": "MALE",
    "phone": "9876543210",
    "guardianName": "Jane Doe",
    "guardianPhone": "9876543211",
    "guardianRelation": "MOTHER",
    "department": "<department_id>",
    "course": "<course_id>"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "Password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "email": "student@example.com",
      "role": "STUDENT"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "..." 
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

### Attendance Endpoints

#### Mark Attendance (Faculty/Admin)
```http
POST /attendance
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "student": "<student_id>",
  "subject": "<subject_id>",
  "date": "2024-02-08",
  "status": "PRESENT",
  "remarks": "Optional remarks"
}
```

#### Bulk Mark Attendance (Faculty/Admin)
```http
POST /attendance/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "subject": "<subject_id>",
  "date": "2024-02-08",
  "attendanceRecords": [
    {
      "student": "<student_id>",
      "status": "PRESENT"
    }
  ]
}
```

#### Get Attendance
```http
GET /attendance?student=<id>&subject=<id>&startDate=2024-01-01&endDate=2024-02-08
Authorization: Bearer <access_token>
```

#### Get Attendance Percentage
```http
GET /attendance/percentage/<student_id>/<subject_id>
Authorization: Bearer <access_token>
```

#### Get Student Attendance Summary
```http
GET /attendance/summary/<student_id>
Authorization: Bearer <access_token>
```

### Exam Endpoints

#### Create Exam (Faculty/Admin)
```http
POST /exams
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Mid Term Exam",
  "type": "MID_TERM",
  "subject": "<subject_id>",
  "course": "<course_id>",
  "semester": 1,
  "date": "2024-03-15T10:00:00Z",
  "duration": 180,
  "totalMarks": 100,
  "passingMarks": 40,
  "venue": "Room 101",
  "instructions": "Bring ID card"
}
```

#### Get All Exams
```http
GET /exams?course=<id>&subject=<id>&semester=1&type=MID_TERM&status=SCHEDULED
Authorization: Bearer <access_token>
```

#### Get Exam by ID
```http
GET /exams/<exam_id>
Authorization: Bearer <access_token>
```

#### Get Upcoming Exams
```http
GET /exams/upcoming/<course_id>?semester=1
Authorization: Bearer <access_token>
```

#### Update Exam (Faculty/Admin)
```http
PUT /exams/<exam_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "date": "2024-03-20T10:00:00Z",
  "venue": "Room 102"
}
```

#### Publish Exam (Admin)
```http
PATCH /exams/<exam_id>/publish
Authorization: Bearer <access_token>
```

#### Delete Exam (Admin)
```http
DELETE /exams/<exam_id>
Authorization: Bearer <access_token>
```

### Result Endpoints

#### Submit Result (Faculty/Admin)
```http
POST /results
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "student": "<student_id>",
  "exam": "<exam_id>",
  "subject": "<subject_id>",
  "marksObtained": 85,
  "totalMarks": 100,
  "remarks": "Excellent performance"
}
```

#### Bulk Submit Results (Faculty/Admin)
```http
POST /results/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "exam": "<exam_id>",
  "results": [
    {
      "student": "<student_id>",
      "subject": "<subject_id>",
      "marksObtained": 85,
      "totalMarks": 100
    }
  ]
}
```

#### Publish Results (Admin)
```http
POST /results/publish
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "examId": "<exam_id>"
}
```

#### Get Student Results
```http
GET /results/student/<student_id>?exam=<id>&subject=<id>&semester=1
Authorization: Bearer <access_token>
```

#### Calculate SGPA
```http
GET /results/sgpa/<student_id>/<semester>
Authorization: Bearer <access_token>
```

#### Calculate CGPA
```http
GET /results/cgpa/<student_id>
Authorization: Bearer <access_token>
```

#### Get Exam Results (Faculty/Admin)
```http
GET /results/exam/<exam_id>
Authorization: Bearer <access_token>
```

### Notification Endpoints

#### Get User Notifications
```http
GET /notifications?isRead=false&category=EXAM&type=ALERT&page=1&limit=20
Authorization: Bearer <access_token>
```

#### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <access_token>
```

#### Mark Notifications as Read
```http
PATCH /notifications/mark-read
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "notificationIds": ["<id1>", "<id2>"]
}
```

#### Mark All as Read
```http
PATCH /notifications/mark-all-read
Authorization: Bearer <access_token>
```

#### Delete Notification
```http
DELETE /notifications/<notification_id>
Authorization: Bearer <access_token>
```

#### Create Notification (Admin)
```http
POST /notifications
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recipient": "<user_id>",
  "type": "ANNOUNCEMENT",
  "category": "EXAM",
  "title": "Exam Schedule Released",
  "message": "Mid-term exam schedule has been released",
  "priority": "HIGH",
  "actionUrl": "/exams"
}
```

#### Send Bulk Notification (Admin)
```http
POST /notifications/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "recipientQuery": { "role": "STUDENT" },
  "type": "ANNOUNCEMENT",
  "title": "Holiday Notice",
  "message": "University will be closed tomorrow"
}
```

### Student Endpoints

#### Get All Students (Admin/Faculty)
```http
GET /students?page=1&limit=20&department=<id>&course=<id>
Authorization: Bearer <access_token>
```

#### Get Student by ID
```http
GET /students/<student_id>
Authorization: Bearer <access_token>
```

#### Update Student (Admin)
```http
PUT /students/<student_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phone": "9876543210",
  "address": "New Address"
}
```

#### Delete Student (Admin)
```http
DELETE /students/<student_id>
Authorization: Bearer <access_token>
```

### Faculty Endpoints

#### Get All Faculty (Admin)
```http
GET /faculty?page=1&limit=20&department=<id>
Authorization: Bearer <access_token>
```

#### Get Faculty by ID
```http
GET /faculty/<faculty_id>
Authorization: Bearer <access_token>
```

#### Update Faculty (Admin)
```http
PUT /faculty/<faculty_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phone": "9876543210",
  "specialization": "Computer Science"
}
```

#### Delete Faculty (Admin)
```http
DELETE /faculty/<faculty_id>
Authorization: Bearer <access_token>
```

### Course Endpoints

#### Create Course (Admin)
```http
POST /courses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Bachelor of Technology",
  "code": "BTECH",
  "department": "<department_id>",
  "duration": 4,
  "totalSemesters": 8,
  "description": "4-year engineering program"
}
```

#### Get All Courses
```http
GET /courses?department=<id>&page=1&limit=20
Authorization: Bearer <access_token>
```

#### Get Course by ID
```http
GET /courses/<course_id>
Authorization: Bearer <access_token>
```

#### Update Course (Admin)
```http
PUT /courses/<course_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

#### Delete Course (Admin)
```http
DELETE /courses/<course_id>
Authorization: Bearer <access_token>
```

### Subject Endpoints

#### Create Subject (Admin)
```http
POST /subjects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Data Structures",
  "code": "CS201",
  "course": "<course_id>",
  "semester": 3,
  "credits": 4,
  "type": "THEORY",
  "description": "Introduction to data structures"
}
```

#### Get All Subjects
```http
GET /subjects?course=<id>&semester=3&page=1&limit=20
Authorization: Bearer <access_token>
```

#### Get Subject by ID
```http
GET /subjects/<subject_id>
Authorization: Bearer <access_token>
```

#### Update Subject (Admin)
```http
PUT /subjects/<subject_id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "credits": 5
}
```

#### Delete Subject (Admin)
```http
DELETE /subjects/<subject_id>
Authorization: Bearer <access_token>
```

### Fee Endpoints

#### Get All Fees
```http
GET /fees?course=<id>&semester=1
Authorization: Bearer <access_token>
```

### Payment Endpoints

#### Create Payment
```http
POST /payments
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "student": "<student_id>",
  "fee": "<fee_id>",
  "amount": 50000,
  "paymentMethod": "UPI",
  "transactionId": "TXN123456"
}
```

#### Get All Payments
```http
GET /payments?student=<id>&status=COMPLETED
Authorization: Bearer <access_token>
```

### Dashboard Endpoints

#### Get Admin Dashboard Stats
```http
GET /dashboard/admin
Authorization: Bearer <access_token>
```

#### Get Student Dashboard
```http
GET /dashboard/student
Authorization: Bearer <access_token>
```

## 🗄️ Database Models

### Core Models

1. **User** - Authentication and authorization
2. **Student** - Student profiles and academic records
3. **Faculty** - Faculty profiles and assignments
4. **Department** - Academic departments
5. **Course** - Course definitions
6. **Subject** - Subject details
7. **Attendance** - Attendance tracking
8. **Exam** - Examination management
9. **Result** - Student results and grades
10. **Fee** - Fee structures
11. **Payment** - Payment transactions
12. **Notification** - In-app notifications
13. **AuditLog** - Audit trail

## 🔐 Security Features

- **Authentication**: JWT with RS256 algorithm
- **Authorization**: Role-based access control (RBAC)
- **Password**: Bcrypt hashing with 12 rounds
- **Rate Limiting**: Role-specific rate limits
- **Input Validation**: Zod schema validation
- **Security Headers**: Helmet.js
- **CORS**: Whitelist-based
- **Token Blacklisting**: Redis-based
- **Audit Logging**: All actions tracked

## ⚡ Performance Optimizations

- **Database**: MongoDB indexes on frequently queried fields
- **Caching**: Redis for API responses and sessions
- **Pagination**: Default 20 items, max 100
- **Connection Pooling**: MongoDB connection pool (100 max)
- **Graceful Shutdown**: Proper cleanup on SIGTERM/SIGINT

## 🔧 Development

### Running in Development Mode

```bash
npm run dev
```

### Environment Variables

See `.env.example` for all available configuration options.

### Logging

Logs are stored in `logs/` directory:
- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

## 🐳 Docker Deployment

*(To be added)*

## 📝 License

ISC

## 👥 Team

Haridwar University Development Team

---

**Note**: This is a production-ready ERP system. Make sure to change all default secrets and credentials before deploying to production!
