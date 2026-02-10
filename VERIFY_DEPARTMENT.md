# Department Module Verification Guide

## Quick Verification Steps

### Step 1: Verify Backend is Running
Open backend terminal and check for:
```
✅ MongoDB connected successfully
✅ Redis connected and ready
🚀 Server running on port 5000
```

### Step 2: Verify Frontend is Running
Open frontend terminal and check for:
```
➜  Local:   http://localhost:5174/
```

### Step 3: Verify Departments in Database
Run this command in backend folder:
```bash
npm run seed:dept
```

Expected output:
```
✅ Created 5 departments
  - Computer Science (CSE)
  - Electronics and Communication (ECE)
  - Mechanical Engineering (MECH)
  - Civil Engineering (CIVIL)
  - Electrical Engineering (EEE)
```

### Step 4: Test in Browser

1. **Open the application**
   - Go to: http://localhost:5174
   - Login with: rramteke2003@gmail.com
   - Enter OTP from backend terminal

2. **Navigate to Department Management**
   - Click on "Departments" in the sidebar
   - OR go directly to: http://localhost:5174/admin/departments

3. **Verify Departments Display**
   - Left panel should show 5 departments
   - Each department should show:
     - Department name
     - Department code
     - HOD name (if available)

4. **Test Create Department**
   - Click "Add Department" button
   - Fill in form:
     ```
     Name: Information Technology
     Code: IT
     HOD Name: Dr. Sarah Johnson
     Description: Department of Information Technology
     ```
   - Click "Create"
   - New department should appear in list immediately

5. **Test View Department Details**
   - Click on any department in the left panel
   - Right panel should show:
     - Department name
     - Department code
     - HOD name
     - Description
     - List of courses (if any)

6. **Test Edit Department**
   - Click the pencil icon on any department
   - Modify the description
   - Click "Update"
   - Changes should reflect immediately

7. **Test Delete Department**
   - Click the trash icon on any department
   - Confirm deletion
   - Department should disappear from list

## Troubleshooting

### Problem: Departments not showing in frontend

**Solution 1: Check browser console (F12)**
- Look for any red errors
- Check if API calls are being made
- Verify API URL is correct (should be http://localhost:5000/api/v1)

**Solution 2: Check backend logs**
- Look for any errors when fetching departments
- Verify authentication is working

**Solution 3: Verify data in database**
Run seed script again:
```bash
cd FinalErp/backend
npm run seed:dept
```

**Solution 4: Clear browser cache**
- Press Ctrl+Shift+R to hard refresh
- Or clear browser cache and reload

### Problem: "Network Error" when creating department

**Solution 1: Verify backend is running**
```bash
# Check if backend is responding
curl http://localhost:5000/health
```

**Solution 2: Check CORS settings**
Backend should allow requests from http://localhost:5174

**Solution 3: Verify authentication**
- Make sure you're logged in
- Check if token is in localStorage (F12 > Application > Local Storage)

### Problem: Department created but not showing

**Solution 1: Check React Query cache**
The frontend uses React Query with these settings:
- `refetchOnWindowFocus: true`
- `staleTime: 0`

Try clicking away and back to the page.

**Solution 2: Manual refresh**
Click the refresh button or reload the page.

**Solution 3: Check backend response**
Open browser console (F12) and check the API response:
- Should see: `🟢 API Response: /departments 200`
- Response should contain the new department

## API Testing with curl

If you want to test the API directly:

### 1. Get all departments (requires auth)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/v1/departments
```

### 2. Create department (requires auth)
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Dept","code":"TEST","description":"Test"}' \
  http://localhost:5000/api/v1/departments
```

## Expected Behavior

### ✅ Working Correctly
- Departments load immediately when page opens
- Creating department shows success toast
- New department appears in list without refresh
- Clicking department shows details in right panel
- Editing department updates immediately
- Deleting department removes from list immediately
- All operations persist to database

### ❌ Not Working
- Blank page or loading forever
- "Network Error" messages
- Departments don't appear after creation
- Changes don't persist after refresh
- 401 Unauthorized errors

## Files to Check

If something isn't working, check these files:

### Frontend
1. `frontend/src/services/departmentService.js` - API calls
2. `frontend/src/pages/Admin/DepartmentManagement.jsx` - UI component
3. `frontend/src/services/api.js` - API configuration
4. `frontend/.env` - API URL configuration

### Backend
1. `backend/src/controllers/department.controller.js` - Request handlers
2. `backend/src/services/department.service.js` - Business logic
3. `backend/src/routes/department.routes.js` - Route definitions
4. `backend/src/models/Department.js` - Database schema
5. `backend/src/app.js` - Route registration

## Success Indicators

When everything is working correctly, you should see:

### In Browser Console (F12)
```
🔧 API Configuration: { API_URL: "http://localhost:5000/api/v1" }
🔵 API Request: GET /departments
🟢 API Response: /departments 200
```

### In Backend Terminal
```
2026-02-09 12:23:22 [debug]: GET /api/v1/departments
```

### In Frontend
- Departments list populated
- Click interactions work smoothly
- Toast notifications appear on actions
- No error messages

## Next Steps After Verification

Once departments are working:
1. ✅ Create departments for your institution
2. ✅ Add courses to departments (Course Management)
3. ✅ Add subjects to courses (Subject Management)
4. ✅ Assign faculty to departments
5. ✅ Assign students to courses

## Summary

The department module is fully functional with:
- ✅ Complete CRUD operations
- ✅ Real-time updates
- ✅ Database persistence
- ✅ Proper error handling
- ✅ Authentication & authorization
- ✅ Responsive UI

If you've verified all steps above and everything works, the department module is ready for production use!
