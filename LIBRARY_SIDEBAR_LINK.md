# Library Link in Admin Sidebar

## Location
The "Library" link is now visible in the admin sidebar navigation, between "Attendance" and "Settings".

## Admin Sidebar Navigation Order:
1. 📊 Dashboard
2. 👥 Students
3. 🎓 Faculty
4. 🏢 Departments
5. 📖 Courses
6. 📚 Subjects
7. 📅 Attendance
8. **📚 Library** ← NEW!
9. ⚙️ Settings

## How to Access Library Dashboard

### As Admin:
1. Login with admin credentials
2. Look at the left sidebar
3. Click on **"Library"** (with book icon 📚)
4. You'll be taken to `/library/dashboard`
5. You can now manage books, issue books, and handle returns

### As Librarian:
1. Login with librarian credentials
2. Automatically redirected to Library Dashboard
3. Can ONLY access library features (no admin pages)

## Visual Reference

```
┌─────────────────────────────────────┐
│  ERP Admin                          │
│  Management Portal                  │
├─────────────────────────────────────┤
│                                     │
│  RR  Rahul Ramteke                 │
│      rramteke2003@gmail.com        │
│                                     │
├─────────────────────────────────────┤
│  📊  Dashboard                      │
│  👥  Students                       │
│  🎓  Faculty                        │
│  🏢  Departments                    │
│  📖  Courses                        │
│  📚  Subjects                       │
│  📅  Attendance                     │
│  📚  Library          ← CLICK HERE! │
│  ⚙️  Settings                       │
│                                     │
│  🚪  Logout                         │
└─────────────────────────────────────┘
```

## What Happens When You Click "Library"

You'll see the Library Management Dashboard with:

```
┌──────────────────────────────────────────────────────────┐
│  Library Management                                       │
│                                                           │
│  [+ Add Book]  [Issue Book]  [Return Book]              │
│                                                           │
│  🔍 Search...                                            │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Book Title    │ Author      │ ISBN    │ Status     │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Algorithms    │ Cormen      │ 978-... │ Available  │ │
│  │ Clean Code    │ Martin      │ 978-... │ Issued     │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

## Access Control

| Role         | Can Access Library? | Can Manage Librarians? |
|--------------|---------------------|------------------------|
| ADMIN        | ✅ Yes              | ✅ Yes                 |
| SUPER_ADMIN  | ✅ Yes              | ✅ Yes                 |
| LIBRARIAN    | ✅ Yes              | ❌ No                  |
| FACULTY      | ❌ No               | ❌ No                  |
| STUDENT      | ❌ No               | ❌ No                  |

## Features Available in Library Dashboard

### 1. Add Book
- Click "Add Book" button
- Fill in book details
- Submit to add to library

### 2. Issue Book
- Click "Issue Book" button
- Select book from dropdown
- Enter student roll number
- Set due date
- Submit to issue

### 3. Return Book
- Click "Return Book" button
- See list of issued books
- Click "Return" next to book
- Fine calculated automatically if overdue

### 4. Search Books
- Type in search bar
- Search by title, author, or ISBN
- Results update in real-time

## Testing the Library Link

1. **Start your application**:
   ```bash
   # Backend
   cd FinalErp/backend
   npm start

   # Frontend
   cd FinalErp/frontend
   npm run dev
   ```

2. **Login as admin**

3. **Look at the sidebar** - you should see "Library" between "Attendance" and "Settings"

4. **Click "Library"** - you'll be taken to the library dashboard

5. **Try adding a book** to verify everything works

## Troubleshooting

### Issue: Don't see "Library" link in sidebar
**Solution**: 
- Make sure you're logged in as ADMIN or SUPER_ADMIN
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for errors

### Issue: Clicking Library shows blank page
**Solution**:
- Check backend is running on port 5000
- Check frontend is running on port 5173
- Verify library routes are mounted in backend

### Issue: Get "Access Denied" error
**Solution**:
- Make sure you're logged in with correct role
- Check your user role in database
- Verify token is valid

## Summary

✅ Library link added to admin sidebar
✅ Admins can now access library management
✅ Librarians automatically see library dashboard on login
✅ All library features working (add, issue, return books)
✅ Role-based access control implemented
