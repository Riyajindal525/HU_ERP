# Library Management System - Testing Guide

## Quick Start Testing

### Step 1: Start the Application
```bash
# Terminal 1 - Backend
cd FinalErp/backend
npm start

# Terminal 2 - Frontend
cd FinalErp/frontend
npm run dev
```

### Step 2: Login as Admin
1. Open browser: `http://localhost:5173`
2. Login with your admin credentials
3. You should be redirected to `/admin/dashboard`

### Step 3: Create a Librarian
1. Click the **Settings** icon (gear icon) in the admin sidebar
2. Click the **"Librarian Management"** tab
3. Click **"Add New Librarian"** button
4. Fill in the form:
   - First Name: `John`
   - Last Name: `Librarian`
   - Email: `librarian@huroorkee.ac.in`
   - Password: `password123`
5. Click **"Create Librarian"**
6. You should see success message
7. The librarian should appear in the table

### Step 4: Test Librarian Login
1. **Logout** from admin account
2. Login with librarian credentials:
   - Email: `librarian@huroorkee.ac.in`
   - Password: `password123`
3. You should be **automatically redirected** to `/library/dashboard`
4. You should see the Library Management page with:
   - "Add Book" button
   - "Issue Book" button
   - "Return Book" button
   - Search bar
   - Books table

### Step 5: Add a Book
1. Click **"Add Book"** button
2. Fill in the form:
   - Title: `Introduction to Algorithms`
   - Author: `Thomas H. Cormen`
   - ISBN: `978-0262033848`
   - Category: `Computer Science`
   - Publisher: `MIT Press`
   - Published Year: `2009`
   - Total Copies: `5`
3. Click **"Add Book"**
4. Book should appear in the table with status "Available"

### Step 6: Issue a Book
**Prerequisites**: You need a student with a roll number in the database

1. Click **"Issue Book"** button
2. Select the book you just added
3. Enter student roll number (enrollment number)
4. Set due date (e.g., 7 days from today)
5. Click **"Issue Book"**
6. Success message should appear
7. Book's available copies should decrease

### Step 7: Return a Book
1. Click **"Return Book"** button
2. You should see the issued book in the list
3. Click **"Return"** button next to the book
4. If returned on time: "Book returned successfully"
5. If overdue: "Book returned. Fine: ₹X" (₹5 per day)
6. Book's available copies should increase

### Step 8: Test Admin Can Remove Librarian
1. Logout from librarian account
2. Login as admin again
3. Go to Settings → Librarian Management
4. Click the **trash icon** next to the librarian
5. Confirm deletion
6. Librarian should be removed from the table
7. Try logging in with librarian credentials - should fail

## Expected Behaviors

### Role-Based Access
- ✅ LIBRARIAN can ONLY access `/library/dashboard`
- ✅ LIBRARIAN cannot access admin pages
- ✅ ADMIN can access admin pages and manage librarians
- ✅ Unauthorized access redirects to appropriate dashboard

### Library Operations
- ✅ Add book creates new book with available copies = total copies
- ✅ Issue book decrements available copies
- ✅ Return book increments available copies
- ✅ Cannot issue book if no copies available
- ✅ Cannot issue same book to same student twice
- ✅ Fine calculated automatically for overdue books

### Search Functionality
- ✅ Search by book title
- ✅ Search by author name
- ✅ Search by ISBN
- ✅ Case-insensitive search

## Common Issues & Solutions

### Issue: "Student with roll number not found"
**Solution**: Make sure you have students in the database with enrollment numbers. Use the student roll number (enrollmentNumber field) when issuing books.

### Issue: "Book with this ISBN already exists"
**Solution**: Each book must have a unique ISBN. Change the ISBN or update the existing book.

### Issue: "Book is not available for issue"
**Solution**: All copies are issued. Wait for a return or add more copies.

### Issue: Librarian can access admin pages
**Solution**: Clear browser cache and cookies, then login again. The ProtectedRoute should redirect unauthorized access.

### Issue: Cannot see librarians in Settings
**Solution**: Make sure you're on the "Librarian Management" tab and the backend is running.

## API Testing (Optional)

### Using curl or Postman

#### Get All Librarians (as Admin)
```bash
curl -X GET http://localhost:5000/api/v1/auth/users?role=LIBRARIAN \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### Add Book (as Librarian)
```bash
curl -X POST http://localhost:5000/api/v1/library/books \
  -H "Authorization: Bearer YOUR_LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "category": "Software Engineering",
    "totalCopies": 3
  }'
```

#### Issue Book (as Librarian)
```bash
curl -X POST http://localhost:5000/api/v1/library/issues \
  -H "Authorization: Bearer YOUR_LIBRARIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "BOOK_ID_HERE",
    "rollNumber": "2024CS001",
    "dueDate": "2026-03-10"
  }'
```

## Database Verification

### Check Librarians in MongoDB
```javascript
// In MongoDB shell or Compass
db.users.find({ role: "LIBRARIAN" })
```

### Check Books
```javascript
db.books.find()
```

### Check Book Issues
```javascript
db.bookissues.find()
```

## Success Criteria
- ✅ Admin can create librarians
- ✅ Admin can view all librarians
- ✅ Admin can delete librarians
- ✅ Librarian can login and see ONLY library dashboard
- ✅ Librarian can add books
- ✅ Librarian can issue books to students
- ✅ Librarian can return books with fine calculation
- ✅ Search works for finding books
- ✅ Role-based redirects work correctly

## Notes
- All user deletions are soft deletes (data preserved)
- Fine is ₹5 per day for overdue books
- Roll number must match student's enrollmentNumber field
- Books table shows real-time availability status
