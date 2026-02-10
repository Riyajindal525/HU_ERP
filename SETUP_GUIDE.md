# Setup Guide - Populate Database with Sample Data

## Why is the Database Empty?

MongoDB creates collections **only when you insert data**. Right now:
- ✅ Server is running
- ✅ Database connection works
- ❌ **No data exists yet**

## Quick Setup (3 Steps)

### Step 1: Seed the Database with Sample Data

Run this command to populate your database with sample data:

```bash
cd backend
npm run seed
```

This will create:
- ✅ 1 Admin user
- ✅ 2 Faculty members
- ✅ 5 Students
- ✅ 3 Departments (CSE, ECE, ME)
- ✅ 2 Courses (B.Tech CSE, B.Tech ECE)
- ✅ 4 Subjects (Data Structures, DBMS, Web Dev, OS)
- ✅ 2 Exams
- ✅ 10 Results (5 students × 2 exams)
- ✅ 150 Attendance records (5 students × 30 days)
- ✅ 1 Fee structure

### Step 2: Login Credentials

After seeding, you can login with these accounts:

#### Admin Account
```
Email: admin@haridwar.edu
Password: Admin@123
```

#### Faculty Accounts
```
Email: faculty1@haridwar.edu
Password: Faculty@123

Email: faculty2@haridwar.edu
Password: Faculty@123
```

#### Student Accounts
```
Email: student1@haridwar.edu
Password: Student@123

Email: student2@haridwar.edu
Password: Student@123

Email: student3@haridwar.edu
Password: Student@123

Email: student4@haridwar.edu
Password: Student@123

Email: student5@haridwar.edu
Password: Student@123
```

### Step 3: Start Using the System

1. **Start Backend** (if not already running):
```bash
cd backend
npm run dev
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
```

3. **Open Browser**:
```
http://localhost:5173
```

4. **Login** with any of the accounts above

---

## Alternative: Create Only Admin User

If you just want to create an admin user without sample data:

```bash
cd backend
npm run create-admin
```

This creates:
```
Email: admin@haridwar.edu
Password: Admin@123
```

Then you can manually add students, courses, etc. through the admin panel.

---

## What Data Gets Created?

### 1. Users & Profiles
- **1 Admin** - Full system access
- **2 Faculty** - Can mark attendance, create exams, submit results
- **5 Students** - Can view their attendance, exams, results

### 2. Academic Structure
- **3 Departments**:
  - Computer Science & Engineering (CSE)
  - Electronics & Communication (ECE)
  - Mechanical Engineering (ME)

- **2 Courses**:
  - B.Tech in Computer Science (4 years, 8 semesters)
  - B.Tech in Electronics (4 years, 8 semesters)

- **4 Subjects**:
  - Data Structures and Algorithms (Semester 3)
  - Database Management Systems (Semester 5)
  - Web Development (Semester 5)
  - Operating Systems (Semester 7)

### 3. Exams & Results
- **2 Exams**:
  - Mid Term - Data Structures (100 marks)
  - End Term - Database Management (100 marks)

- **10 Results**:
  - Each student has results for both exams
  - Marks range from 65-95
  - Grades automatically calculated (A+, A, B+, etc.)

### 4. Attendance
- **150 Records**:
  - 30 days of attendance for each student
  - ~80% attendance rate (realistic)
  - For Database Management subject

### 5. Fee Structure
- **Semester 5 Fees**:
  - Tuition: ₹50,000
  - Exam: ₹2,000
  - Library: ₹1,000
  - Lab: ₹3,000
  - Other: ₹2,000
  - **Total: ₹58,000**

---

## Verify Data in MongoDB

### Option 1: MongoDB Compass (GUI)
1. Download MongoDB Compass
2. Connect to: `mongodb+srv://rahulramtekehu_db_user:Rramteke1199@cluster0.u8iphna.mongodb.net/`
3. Select database: `haridwar-erp`
4. View collections: users, students, courses, etc.

### Option 2: MongoDB Shell
```bash
mongosh "mongodb+srv://rahulramtekehu_db_user:Rramteke1199@cluster0.u8iphna.mongodb.net/"

use haridwar-erp
show collections
db.users.countDocuments()
db.students.find().pretty()
```

### Option 3: API Endpoints
```bash
# Get all students (requires admin login)
curl http://localhost:5000/api/v1/students

# Get all courses
curl http://localhost:5000/api/v1/courses

# Health check
curl http://localhost:5000/health
```

---

## Student Dashboard Features

Once logged in as a student, they can see:

### 1. Dashboard
- Overview of attendance percentage
- Upcoming exams
- Recent notifications
- CGPA/SGPA

### 2. Attendance
- Subject-wise attendance percentage
- Date-wise attendance records
- Attendance summary

### 3. Exams
- Upcoming exam schedule
- Exam details (date, time, venue)
- Total marks and passing marks

### 4. Results
- Exam-wise results
- Subject-wise marks
- Grade and percentage
- SGPA and CGPA

### 5. Courses
- Enrolled courses
- Subject details
- Course structure

### 6. Fees
- Fee structure
- Payment history
- Due dates

---

## Faculty Dashboard Features

Faculty members can:

### 1. Mark Attendance
- Single student attendance
- Bulk attendance for entire class
- View attendance reports

### 2. Create Exams
- Schedule exams
- Set marks and passing criteria
- Publish exam schedules

### 3. Submit Results
- Enter marks for students
- Bulk result submission
- Publish results

### 4. View Students
- Student list
- Student profiles
- Academic performance

---

## Admin Dashboard Features

Admin has full access to:

### 1. User Management
- Create/edit/delete users
- Manage roles and permissions
- View all users

### 2. Academic Management
- Manage departments
- Manage courses
- Manage subjects
- Assign faculty to subjects

### 3. Student Management
- Add/edit/delete students
- View student records
- Manage enrollments

### 4. Faculty Management
- Add/edit/delete faculty
- Assign departments
- View faculty profiles

### 5. Exam Management
- Create exam schedules
- Publish results
- View exam reports

### 6. Fee Management
- Create fee structures
- View payment records
- Generate fee reports

### 7. Reports & Analytics
- Attendance reports
- Result analysis
- Performance metrics
- Dashboard statistics

---

## Troubleshooting

### "Database is empty"
Run: `npm run seed`

### "Admin already exists"
The seed script clears all data first. If you want to keep existing data, manually add records through API.

### "Cannot connect to MongoDB"
Check your `.env` file has correct `MONGODB_URI`

### "Validation error"
Make sure all required fields are provided when creating records

---

## Next Steps

1. ✅ Run `npm run seed` to populate database
2. ✅ Login with student account
3. ✅ Explore student dashboard
4. ✅ Check attendance, exams, results
5. ✅ Login with faculty account
6. ✅ Try marking attendance
7. ✅ Login with admin account
8. ✅ Explore admin features

---

## Custom Data

If you want to add your own data instead of sample data:

### 1. Use Admin Panel
- Login as admin
- Use the UI to add departments, courses, students, etc.

### 2. Use API Endpoints
- Use Postman or curl to call API endpoints
- Refer to README.md for API documentation

### 3. Modify Seed Script
- Edit `backend/scripts/seedDatabase.js`
- Add your own data
- Run `npm run seed`

---

## Important Notes

⚠️ **Security:**
- Change default passwords after first login
- Don't use these credentials in production
- Update JWT secrets in `.env`

⚠️ **Data:**
- Seed script **clears all existing data**
- Backup your data before running seed
- Sample data is for testing only

✅ **Ready to Use:**
- All features are functional
- Data relationships are properly set up
- You can start testing immediately
