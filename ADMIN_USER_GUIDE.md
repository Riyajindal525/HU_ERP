# Admin User Guide - Role-Based Access Control

## Overview
Your ERP system now has complete role-based access control. Only administrators can create student and faculty accounts. Students and faculty can only login using OTP authentication.

## Admin Functions

### 1. Creating Student Accounts

#### Via Admin Dashboard
1. Login as admin: `rramteke2003@gmail.com`
2. Navigate to **Student Management** page
3. Click **"Add Student"** button (top right)
4. Fill in the form:
   - **Role**: STUDENT (pre-filled)
   - **First Name**: Student's first name
   - **Last Name**: Student's last name
   - **Email**: Student's email address
5. Click **"Create Student"**
6. Success! The student account is created
7. A temporary password is generated (shown in backend console)
8. Share the email with the student

#### What Happens Behind the Scenes
- User account created with role STUDENT
- Student profile created automatically
- Temporary 6-digit password generated
- Password logged to backend console
- Student can login using OTP (recommended)

### 2. Creating Faculty Accounts

#### Via Admin Dashboard
1. Login as admin: `rramteke2003@gmail.com`
2. Navigate to **Faculty Management** page
3. Click **"Add Faculty"** button (top right)
4. Fill in the form:
   - **Role**: FACULTY (pre-filled)
   - **First Name**: Faculty's first name
   - **Last Name**: Faculty's last name
   - **Email**: Faculty's email address
5. Click **"Create Faculty"**
6. Success! The faculty account is created
7. A temporary password is generated (shown in backend console)
8. Share the email with the faculty member

#### What Happens Behind the Scenes
- User account created with role FACULTY
- Faculty profile created automatically
- Temporary 6-digit password generated
- Password logged to backend console
- Faculty can login using OTP (recommended)

### 3. Managing Existing Accounts

#### Student Management
- **View All Students**: See list of all registered students
- **Assign Course**: Click book icon to assign student to course/department
- **Create Fee Request**: Click credit card icon to create pending fee
- **Delete Student**: Click trash icon to remove student account

#### Faculty Management
- **View All Faculty**: See list of all faculty members
- **Allocate Subjects**: Click book icon to assign subjects to faculty
- **Delete Faculty**: Click trash icon to remove faculty account

## Student/Faculty Login Process

### For New Users (Created by Admin)
1. Go to login page: `http://localhost:3000/login`
2. Enter email address (provided by admin)
3. Click **"Send OTP"**
4. Check email for 6-digit OTP code
   - If email fails, OTP is printed in backend console
5. Enter OTP code
6. Click **"Verify & Login"**
7. Redirected to appropriate dashboard:
   - Students → Student Dashboard
   - Faculty → Faculty Dashboard

### OTP System
- OTP is 6 digits
- Valid for 10 minutes
- Sent to user's email
- If email fails, check backend console logs
- More secure than password login

## Public Registration

### Registration Page Status
- **Public registration is DISABLED**
- Students and faculty cannot self-register
- Registration page shows information message
- Directs users to contact administrator
- Link to login page provided

### Why Registration is Disabled
- **Security**: Only verified users can access system
- **Control**: Admin controls who gets access
- **Data Quality**: Admin ensures correct information
- **Role Assignment**: Admin assigns correct roles

## Testing the System

### Test Creating a Student
1. Login as admin
2. Go to Student Management
3. Click "Add Student"
4. Enter test data:
   ```
   First Name: John
   Last Name: Doe
   Email: john.doe@huroorkee.ac.in
   ```
5. Submit form
6. Check backend console for temporary password
7. Verify student appears in student list

### Test Student Login
1. Open new incognito window
2. Go to login page
3. Enter student email: `john.doe@huroorkee.ac.in`
4. Click "Send OTP"
5. Check backend console for OTP (if email fails)
6. Enter OTP
7. Verify redirect to student dashboard

### Test Creating a Faculty
1. Login as admin
2. Go to Faculty Management
3. Click "Add Faculty"
4. Enter test data:
   ```
   First Name: Jane
   Last Name: Smith
   Email: jane.smith@huroorkee.ac.in
   ```
5. Submit form
6. Check backend console for temporary password
7. Verify faculty appears in faculty list

## Backend Console Logs

### When Creating Accounts
Look for this in backend console:
```
##################################################
# Student Account Created
# Email: john.doe@huroorkee.ac.in
# Temporary Password: 123456
# User should login with OTP instead
##################################################
```

### When Sending OTP
Look for this in backend console:
```
##################################################
# LOGIN OTP for john.doe@huroorkee.ac.in: 654321
##################################################
```

## Troubleshooting

### "Authentication failed" Error
- Make sure you're logged in as admin
- Check if your session expired
- Try logging out and logging back in

### "User already exists" Error
- Email is already registered
- Check if account was created previously
- Use different email address

### OTP Not Received
- Check backend console logs
- OTP is printed there if email fails
- OTP valid for 10 minutes only
- Request new OTP if expired

### Student/Faculty Not Appearing in List
- Refresh the page
- Check if creation was successful
- Look for error messages in console
- Verify backend is running

## API Endpoints (For Testing)

### Create Student
```bash
POST http://localhost:5000/api/v1/students
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@huroorkee.ac.in",
  "role": "STUDENT"
}
```

### Create Faculty
```bash
POST http://localhost:5000/api/v1/faculty
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@huroorkee.ac.in",
  "role": "FACULTY"
}
```

### Send OTP
```bash
POST http://localhost:5000/api/v1/auth/send-otp
Content-Type: application/json

{
  "email": "john.doe@huroorkee.ac.in"
}
```

### Login with OTP
```bash
POST http://localhost:5000/api/v1/auth/login-with-otp
Content-Type: application/json

{
  "email": "john.doe@huroorkee.ac.in",
  "otp": "123456"
}
```

## Security Features

1. **Role-Based Access Control**
   - Only admins can create accounts
   - Students can only access student features
   - Faculty can only access faculty features

2. **Authentication Required**
   - All API endpoints require valid JWT token
   - Tokens expire after set time
   - Refresh tokens for extended sessions

3. **Authorization Middleware**
   - Routes protected by role
   - Unauthorized access blocked
   - Clear error messages

4. **OTP Authentication**
   - More secure than passwords
   - Time-limited validity
   - One-time use only

## Best Practices

### For Admins
1. **Verify Email Addresses**: Double-check before creating accounts
2. **Share Credentials Securely**: Use secure channels to share login info
3. **Monitor Account Creation**: Keep track of who you create
4. **Regular Cleanup**: Remove inactive accounts
5. **Use OTP Login**: Recommend OTP over password login

### For Students/Faculty
1. **Use OTP Login**: More secure than password
2. **Keep Email Secure**: OTP sent to email
3. **Don't Share Credentials**: Keep login info private
4. **Report Issues**: Contact admin if problems occur
5. **Update Profile**: Complete profile information after first login

## Next Steps

1. **Test the System**
   - Create test student account
   - Create test faculty account
   - Test OTP login for both

2. **Create Real Accounts**
   - Add actual students
   - Add actual faculty
   - Assign courses and subjects

3. **Monitor Usage**
   - Check backend logs
   - Monitor for errors
   - Gather user feedback

4. **Customize as Needed**
   - Adjust email templates
   - Modify OTP expiry time
   - Add additional fields

## Support

If you encounter any issues:
1. Check backend console logs
2. Check browser console for errors
3. Verify all services are running
4. Review this guide
5. Check the ROLE_BASED_ACCESS_CONTROL.md file for technical details

## Summary

✅ Admin can create student accounts
✅ Admin can create faculty accounts  
✅ Public registration disabled
✅ OTP login system working
✅ Role-based redirects implemented
✅ All endpoints secured
✅ UI updated with Add buttons
✅ Comprehensive error handling

Your ERP system now has complete role-based access control!
