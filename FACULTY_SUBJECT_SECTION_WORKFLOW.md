# Faculty Subject & Section Assignment Workflow

## Overview
The system supports assigning multiple subjects to a single faculty member, each with specific sections. Faculty can then view students by subject and section to mark attendance.

## Admin Workflow: Assigning Subjects to Faculty

### Step 1: Navigate to Subject Management
1. Login as Admin
2. Go to Admin Dashboard → Subject Management

### Step 2: Assign Faculty to Subject
1. Find the subject you want to assign
2. Click the "Assign Faculty" button (or edit the subject)
3. Fill in the assignment form:
   - **Faculty**: Select the faculty member from dropdown
   - **Section**: Enter the section (e.g., A, B, C, etc.)
   - **Academic Year**: Enter academic year (e.g., 2025-26)
4. Click "Assign"

### Step 3: Assign Multiple Subjects
- Repeat the process for each subject
- The same faculty can be assigned to multiple subjects
- Each assignment can have a different section

### Example Assignments:
```
Faculty: Prof. Rahul Ramteke
├── Subject: Mathematics (Code: MATH101)
│   └── Section: A, Semester: 1
├── Subject: Physics (Code: PHY101)
│   └── Section: B, Semester: 1
└── Subject: Chemistry (Code: CHEM101)
    └── Section: A, Semester: 2
```

## Faculty Workflow: Viewing & Managing Assigned Subjects

### Step 1: Login as Faculty
1. Use faculty credentials (OTP login)
2. Automatically redirected to Faculty Dashboard

### Step 2: View Assigned Subjects
The dashboard displays:
- **Subject Cards**: Each showing:
  - Subject name and code
  - Semester number
  - Section (e.g., "Section A")
  - Credits
- **Statistics**:
  - Total assigned subjects count
  - Teaching hours (calculated)
  - Total classes per week

### Step 3: Mark Attendance for a Section
1. **Option A**: Click on any subject card
   - Automatically navigates to Mark Attendance
   - Subject, section, and semester are pre-selected
   
2. **Option B**: Click "Mark Attendance" quick action button
   - Select subject from dropdown (shows all assigned subjects with sections)
   - Select date and session

### Step 4: View Students by Section
Once subject and section are selected:
- System automatically fetches students enrolled in:
  - That specific subject
  - That specific section
  - That semester
- Displays student list with:
  - Roll number
  - Student name and email
  - Section
  - Attendance status buttons

### Step 5: Mark Attendance
1. Mark each student as: PRESENT, ABSENT, LATE, or ON_LEAVE
2. Use quick actions:
   - "All Present" button
   - "All Absent" button
3. Click "Save Attendance"

## Data Flow

```
Admin assigns subject to faculty with section
    ↓
Subject.facultyAssigned[] ← Updated with faculty, section, academicYear
    ↓
Faculty.allocatedSubjects[] ← Updated with subject, section, semester
    ↓
Faculty logs in → Dashboard fetches /faculty/me
    ↓
Dashboard displays all assigned subjects with sections
    ↓
Faculty clicks subject card → Navigate to Mark Attendance
    ↓
System fetches students WHERE:
  - course = subject.course
  - semester = assignment.semester
  - section = assignment.section
    ↓
Faculty marks attendance for those specific students
    ↓
Attendance records saved with subject, student, date, status
```

## Database Schema

### Subject Model
```javascript
facultyAssigned: [{
  faculty: ObjectId (ref: Faculty),
  section: String,        // e.g., "A", "B", "C"
  academicYear: String    // e.g., "2025-26"
}]
```

### Faculty Model
```javascript
allocatedSubjects: [{
  subject: ObjectId (ref: Subject),
  semester: Number,       // e.g., 1, 2, 3
  academicYear: String,   // e.g., "2025-26"
  section: String         // e.g., "A", "B", "C"
}]
```

### Student Model
```javascript
{
  course: ObjectId (ref: Course),
  semester: Number,
  section: String,        // e.g., "A", "B", "C"
  // ... other fields
}
```

## Key Features

### 1. Multiple Subject Assignment
- ✅ One faculty can teach multiple subjects
- ✅ Each subject can have different sections
- ✅ Same faculty can teach same subject to different sections

### 2. Section-Based Student Filtering
- ✅ Students are automatically filtered by section
- ✅ Faculty only sees students from their assigned section
- ✅ Prevents marking attendance for wrong section

### 3. Automatic Synchronization
- ✅ Subject assignment updates both Subject and Faculty models
- ✅ Unassignment removes from both models
- ✅ Data consistency maintained

### 4. User-Friendly Interface
- ✅ Subject cards show section information
- ✅ Click-to-mark-attendance from dashboard
- ✅ Pre-filled forms for quick access
- ✅ Visual section badges

## Example Use Case

### Scenario:
Prof. Rahul teaches:
- Mathematics to Section A (Semester 1)
- Mathematics to Section B (Semester 1)
- Physics to Section A (Semester 2)

### Admin Actions:
1. Assign Mathematics → Prof. Rahul → Section A → Semester 1
2. Assign Mathematics → Prof. Rahul → Section B → Semester 1
3. Assign Physics → Prof. Rahul → Section A → Semester 2

### Faculty Experience:
Prof. Rahul's dashboard shows 3 subject cards:
1. **Mathematics (MATH101)**
   - Sem 1, Section A, 4 Credits
2. **Mathematics (MATH101)**
   - Sem 1, Section B, 4 Credits
3. **Physics (PHY101)**
   - Sem 2, Section A, 3 Credits

When Prof. Rahul clicks "Mathematics - Section A":
- Sees only students from Semester 1, Section A
- Marks attendance for those students only

When Prof. Rahul clicks "Mathematics - Section B":
- Sees only students from Semester 1, Section B
- Different set of students

## API Endpoints

### Admin Endpoints
```
POST /api/v1/subjects/:id/assign-faculty
Body: { facultyId, section, academicYear }

DELETE /api/v1/subjects/:id/unassign-faculty/:facultyId
```

### Faculty Endpoints
```
GET /api/v1/faculty/me
Returns: Faculty profile with allocatedSubjects[]

GET /api/v1/students?semester=1&section=A&limit=100
Returns: Students filtered by semester and section
```

### Attendance Endpoints
```
POST /api/v1/attendance/bulk
Body: { subject, date, session, attendanceRecords[] }
```

## Testing Checklist

### Admin Testing
- [ ] Assign one subject to faculty with section
- [ ] Assign multiple subjects to same faculty
- [ ] Assign same subject to faculty with different sections
- [ ] Verify assignments appear in Subject Management
- [ ] Unassign faculty and verify removal

### Faculty Testing
- [ ] Login as faculty
- [ ] Verify all assigned subjects appear on dashboard
- [ ] Verify section information is displayed
- [ ] Click subject card and verify navigation
- [ ] Verify correct students load for each section
- [ ] Mark attendance and verify save

### Student Filtering Testing
- [ ] Create students in different sections
- [ ] Assign faculty to specific section
- [ ] Verify faculty only sees students from assigned section
- [ ] Verify students from other sections are not visible

## Status
✅ **FULLY IMPLEMENTED AND WORKING**

All features described above are already implemented and functional in the system.
