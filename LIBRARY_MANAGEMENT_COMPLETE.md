# Library Management System - Complete Implementation

## Overview
Complete library management system with LIBRARIAN role, allowing librarians to manage books, issue books to students, and handle returns with fine calculation.

## Features Implemented

### 1. LIBRARIAN Role
- Added LIBRARIAN role to User model (already existed)
- Librarians can ONLY access library dashboard after login
- No access to admin, student, or faculty pages

### 2. Admin Settings - Librarian Management
- New "Librarian Management" tab in Admin Settings
- Admin can add new librarians with email and password
- Admin can view all librarians in a table
- Admin can remove librarians (soft delete)
- Located at: `/admin/settings` → Librarian Management tab

### 3. Library Dashboard (Librarian View)
- Clean, modern interface matching the design
- **Accessible from Admin Sidebar**: Click "Library" in the admin sidebar to access
- Three main actions:
  - **Add Book**: Add new books to library with ISBN, title, author, category, publisher, etc.
  - **Issue Book**: Issue books to students using their roll number
  - **Return Book**: Return issued books with automatic fine calculation (₹5/day for overdue)
- Search functionality to find books
- Books table showing title, author, ISBN, and availability status
- Located at: `/library/dashboard`
- **Access**: LIBRARIAN, ADMIN, and SUPER_ADMIN can all access the library dashboard

### 4. Backend Implementation

#### Routes (`/api/v1/library`)
- `GET /books` - Get all books with search and filters
- `POST /books` - Add new book
- `GET /books/:id` - Get book by ID
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book (soft delete)
- `POST /issues` - Issue book to student
- `GET /issues` - Get issued books
- `PATCH /issues/:id/return` - Return book with fine calculation
- `GET /statistics` - Get library statistics

#### Models
- **Book**: title, author, isbn, category, publisher, publishedYear, totalCopies, availableCopies
- **BookIssue**: book, student, rollNumber, issueDate, dueDate, returnDate, status, fine

#### Authorization
- All library routes require authentication
- Accessible by: LIBRARIAN, ADMIN, SUPER_ADMIN roles

### 5. User Management (Admin)

#### New Backend Routes
- `GET /api/v1/auth/users?role=LIBRARIAN` - Get all librarians
- `DELETE /api/v1/auth/users/:id` - Delete user (soft delete)

#### Frontend Integration
- Settings page fetches librarians when tab is active
- Create librarian modal with form validation
- Delete confirmation before removing librarian
- Real-time updates after add/remove operations

### 6. Role-Based Redirects

#### Login Component
- STUDENT → `/student/dashboard`
- FACULTY → `/faculty/dashboard`
- LIBRARIAN → `/library/dashboard`
- ADMIN/SUPER_ADMIN → `/admin/dashboard`

#### Protected Routes
- Unauthorized users redirected to their appropriate dashboard
- LIBRARIAN role can only access `/library/dashboard`

## File Changes

### Frontend Files Modified
1. `frontend/src/App.jsx`
   - Added LibraryDashboard import
   - Added library route: `/library/dashboard`
   - Updated to allow LIBRARIAN, ADMIN, and SUPER_ADMIN access

2. `frontend/src/components/ProtectedRoute.jsx`
   - Added role-based redirects for unauthorized access
   - LIBRARIAN redirects to `/library/dashboard`

3. `frontend/src/components/AdminLayout.jsx`
   - Added "Library" link in admin sidebar navigation
   - Imported Library icon from lucide-react
   - Library link points to `/library/dashboard`

4. `frontend/src/pages/Admin/Settings.jsx`
   - Added "Librarian Management" tab
   - Added librarians table with delete functionality
   - Added "Add Librarian" modal
   - Added queries and mutations for librarian management
   - Imported BookOpen, Trash2 icons and api service

4. `frontend/src/pages/Auth/Login.jsx`
   - Added LIBRARIAN role redirect in password login
   - Added LIBRARIAN role redirect in OTP login

5. `frontend/src/pages/Library/LibraryDashboard.jsx`
   - Removed unused BookOpen import

### Backend Files Modified
1. `backend/src/routes/auth.routes.js`
   - Added `GET /users` route for getting users by role
   - Added `DELETE /users/:id` route for deleting users

2. `backend/src/controllers/auth.controller.js`
   - Added `getUsersByRole()` method
   - Added `deleteUser()` method with soft delete

### Existing Files (Already Created)
- `backend/src/models/Book.js`
- `backend/src/models/BookIssue.js`
- `backend/src/services/library.service.js`
- `backend/src/controllers/library.controller.js`
- `backend/src/routes/library.routes.js`
- `frontend/src/pages/Library/LibraryDashboard.jsx`

## How to Use

### For Admin:
1. Login as ADMIN or SUPER_ADMIN
2. **Access Library**: Click "Library" in the sidebar navigation
3. You'll see the Library Dashboard with all library management features
4. **Manage Librarians**: Go to Settings (gear icon) → "Librarian Management" tab
5. Click "Add New Librarian" to create librarian accounts
6. View and remove librarians from the table

### For Librarian:
1. Login with librarian credentials
2. Automatically redirected to Library Dashboard
3. **Add Book**: Click "Add Book" button, fill form, submit
4. **Issue Book**: Click "Issue Book", select book, enter student roll number, set due date
5. **Return Book**: Click "Return Book", select issued book, click "Return"
   - Fine automatically calculated if overdue (₹5 per day)
6. **Search**: Use search bar to find books by title, author, or ISBN

### Book Issue Process:
1. Librarian issues book to student using roll number (enrollment number)
2. System finds student by roll number
3. Book's available copies decremented
4. Issue record created with due date

### Book Return Process:
1. Librarian selects issued book from return modal
2. System calculates fine if overdue
3. Book's available copies incremented
4. Issue record updated with return date and fine

## API Examples

### Add Librarian (Admin)
```bash
POST /api/v1/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "librarian@huroorkee.ac.in",
  "password": "password123",
  "role": "LIBRARIAN"
}
```

### Get All Librarians (Admin)
```bash
GET /api/v1/auth/users?role=LIBRARIAN
```

### Delete Librarian (Admin)
```bash
DELETE /api/v1/auth/users/:id
```

### Add Book (Librarian)
```bash
POST /api/v1/library/books
{
  "title": "Introduction to Algorithms",
  "author": "Thomas H. Cormen",
  "isbn": "978-0262033848",
  "category": "Computer Science",
  "publisher": "MIT Press",
  "publishedYear": 2009,
  "totalCopies": 5
}
```

### Issue Book (Librarian)
```bash
POST /api/v1/library/issues
{
  "bookId": "book_id_here",
  "rollNumber": "2024CS001",
  "dueDate": "2026-03-10"
}
```

### Return Book (Librarian)
```bash
PATCH /api/v1/library/issues/:issueId/return
```

## Security Features
- Only ADMIN/SUPER_ADMIN can add/remove librarians
- Librarians cannot access admin features
- Soft delete for users (data preserved)
- Cannot delete your own account
- Role-based access control on all routes

## Fine Calculation
- ₹5 per day for overdue books
- Calculated automatically on return
- Based on difference between return date and due date

## Status
✅ Complete and ready to use
✅ Backend fully implemented
✅ Frontend fully implemented
✅ Role-based access control working
✅ Admin can manage librarians
✅ Librarians can manage library
✅ Book issue/return with fine calculation

## Next Steps (Optional Enhancements)
- Email notifications for overdue books
- Book reservation system
- Library reports and analytics
- Barcode scanning for books
- Student library history
- Book recommendations
