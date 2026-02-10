# Role-Based Access Control Implementation

## Overview
Implemented a complete role-based access control system where only administrators can create student and faculty accounts. Students and faculty can only login using OTP authentication.

## Changes Made

### Backend Changes

#### 1. Student Controller (`backend/src/controllers/student.controller.js`)
- **Added**: `create()` method for admin-only student account creation
- Generates temporary 6-digit password
- Creates User and Student profile automatically
- Logs credentials to console (for development)
- Returns temporary password in response for admin to share

#### 2. Faculty Controller (`backend/src/controllers/faculty.controller.js`)
- **Added**: `create()` method for admin-only faculty account creation
- Same functionality as student creation
- Generates temporary password
- Creates User and Faculty profile

#### 3. Student Routes (`backend/src/routes/student.routes.js`)
- **Added**: `POST /api/v1/students` route
- Protected with `authenticate` and `authorize('ADMIN', 'SUPER_ADMIN')`
- Only admins can create student accounts

#### 4. Faculty Routes (`backend/src/routes/faculty.routes.js`)
- **Added**: `POST /api/v1/faculty` route
- Protected with `authenticate` and `authorize('ADMIN', 'SUPER_ADMIN')`
- Only admins can create faculty accounts

### Frontend Changes

#### 1. Student Management Page (`frontend/src/pages/Admin/StudentManagement.jsx`)
- **Added**: "Add Student" button in header
- **Added**: `showAddStudentModal` state
- **Added**: `createStudentMutation` using React Query
- **Added**: Add Student modal with form fields:
  - Role (fixed as STUDENT)
  - First Name
  - Last Name
  - Email
  - Info message about OTP login
- Form submits to `studentService.create()`
- Auto-refreshes student list after creation

#### 2. Faculty Management Page (`frontend/src/pages/Admin/FacultyManagement.jsx`)
- **Added**: "Add Faculty" button in header
- **Added**: `showAddFacultyModal` state
- **Added**: `createFacultyMutation` using React Query
- **Added**: Add Faculty modal with form fields:
  - Role (fixed as FACULTY)
  - First Name
  - Last Name
  - Email
  - Info message about OTP login
- Form submits to `facultyService.create()`
- Auto-refreshes faculty list after creation

#### 3. Register Page (`frontend/src/pages/Auth/Register.jsx`)
- **Completely replaced** with information page
- Shows "Registration Disabled" message
- Explains that only admins can create accounts
- Provides instructions for getting access:
  1. Contact administrator
  2. Admin creates account
  3. Login using OTP
- Link to login page
- Contact administrator email link

#### 4. Services (`frontend/src/services/index.js`)
- `studentService.create()` - Already existed
- `facultyService.create()` - Already existed
- Both services ready to use

### Login Flow (Already Implemented)
The login page already redirects based on role:
- **STUDENT** → `/student/dashboard`
- **FACULTY** → `/faculty/dashboard`
- **ADMIN/SUPER_ADMIN** → `/admin/dashboard`

## How It Works

### Admin Creates Account
1. Admin logs into admin dashboard
2. Navigates to Student Management or Faculty Management
3. Clicks "Add Student" or "Add Faculty" button
4. Fills form with:
   - First Name
   - Last Name
   - Email
5. Submits form
6. Backend creates:
   - User account with temporary password
   - Student/Faculty profile
   - Logs credentials to console
7. Admin receives temporary password in response
8. Admin shares email with student/faculty

### Student/Faculty Login
1. User goes to login page
2. Enters email address
3. Clicks "Send OTP"
4. Backend generates 6-digit OTP
5. OTP sent to email (or logged to console if email fails)
6. User enters OTP
7. System verifies OTP
8. User logged in and redirected to appropriate dashboard

## Security Features

1. **Admin-Only Creation**: Only ADMIN and SUPER_ADMIN roles can create accounts
2. **Authentication Required**: All create endpoints require valid JWT token
3. **Authorization Middleware**: Routes protected with role-based authorization
4. **OTP Authentication**: Users login with OTP, not password
5. **Temporary Passwords**: Generated passwords are random 6-digit numbers
6. **Public Registration Disabled**: No self-registration for students/faculty

## API Endpoints

### Create Student
```
POST /api/v1/students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@huroorkee.ac.in",
  "role": "STUDENT"
}

Response:
{
  "success": true,
  "message": "Student account created successfully",
  "data": {
    "user": { ... },
    "student": { ... },
    "tempPassword": "123456"
  }
}
```

### Create Faculty
```
POST /api/v1/faculty
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@huroorkee.ac.in",
  "role": "FACULTY"
}

Response:
{
  "success": true,
  "message": "Faculty account created successfully",
  "data": {
    "user": { ... },
    "faculty": { ... },
    "tempPassword": "654321"
  }
}
```

## Testing

### Test Admin Creating Student
1. Login as admin (rramteke2003@gmail.com)
2. Go to Student Management
3. Click "Add Student"
4. Fill form and submit
5. Check console for temporary password
6. Verify student appears in list

### Test Student Login
1. Go to login page
2. Enter student email
3. Send OTP
4. Check backend console for OTP
5. Enter OTP
6. Verify redirect to student dashboard

## Notes

- Temporary passwords are logged to console in development
- In production, passwords should be sent via email
- OTP system is already implemented and working
- All role-based redirects are already in place
- Frontend services already have create methods
- Backend routes properly protected with auth middleware

## Files Modified

### Backend
- `backend/src/controllers/student.controller.js`
- `backend/src/controllers/faculty.controller.js`
- `backend/src/routes/student.routes.js`
- `backend/src/routes/faculty.routes.js`

### Frontend
- `frontend/src/pages/Admin/StudentManagement.jsx`
- `frontend/src/pages/Admin/FacultyManagement.jsx`
- `frontend/src/pages/Auth/Register.jsx`

## Completion Status
✅ Admin can create student accounts
✅ Admin can create faculty accounts
✅ Public registration disabled
✅ Login redirects based on role
✅ OTP authentication working
✅ Role-based access control implemented
✅ All endpoints protected with authentication
✅ UI updated with Add buttons and modals
