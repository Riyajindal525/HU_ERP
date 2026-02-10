# Department Student Statistics Feature

## Overview
Enhanced the department module to show detailed student statistics categorized by semester and section when viewing department details.

## Features Added

### 1. Backend API Endpoint
**Endpoint**: `GET /api/v1/departments/:id/statistics`

Returns comprehensive department statistics including:
- Total students count
- Total courses count
- List of all courses
- Students grouped by semester
- Students grouped by section
- Students grouped by semester AND section (matrix view)
- Full student details for each group

### 2. Student Information Displayed
For each student in the department, the following details are shown:
- Enrollment Number
- Full Name (First + Last)
- Course Code
- Batch (e.g., "2023-2027")
- Contact (Email or Phone)
- Current Semester
- Section

### 3. Categorization
Students are organized in a hierarchical view:
- **Primary**: Semester (1, 2, 3, etc.)
- **Secondary**: Section (A, B, C, etc.)
- **Display**: Table format with all student details

## UI Layout

### Department Details View (Right Panel)

1. **Department Info Card**
   - Department Code
   - HOD Name
   - Total Students (dynamic count)
   - Total Courses (dynamic count)
   - Description

2. **Students by Semester & Section Card**
   - Grouped by Semester → Section
   - Each group shows:
     - Header: "Semester X - Section Y"
     - Badge: Student count
     - Table with student details:
       - Enrollment Number
       - Name
       - Course
       - Batch
       - Contact

3. **Courses Card**
   - List of all courses in the department
   - Button to add new courses

## API Response Structure

```javascript
{
  success: true,
  data: {
    department: {
      _id: "...",
      name: "Computer Science",
      code: "CSE",
      hodName: "Dr. John Doe",
      description: "..."
    },
    totalStudents: 150,
    totalCourses: 5,
    courses: [
      { _id: "...", name: "B.Tech CSE", code: "BTECH-CSE", degree: "B_TECH" }
    ],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    sections: ["A", "B", "C"],
    studentsBySemester: [
      {
        semester: 1,
        count: 30,
        students: [...]
      }
    ],
    studentsBySection: [
      {
        section: "A",
        count: 50,
        students: [...]
      }
    ],
    semesterSectionMatrix: [
      {
        semester: 1,
        section: "A",
        students: [
          {
            _id: "...",
            firstName: "John",
            lastName: "Doe",
            enrollmentNumber: "2023CSE001",
            currentSemester: 1,
            section: "A",
            course: { name: "B.Tech CSE", code: "BTECH-CSE" },
            batch: "2023-2027",
            email: "john@example.com",
            phone: "1234567890"
          }
        ]
      }
    ]
  }
}
```

## Files Modified

### Backend
1. **`backend/src/routes/department.routes.js`**
   - Added route: `GET /:id/statistics`

2. **`backend/src/controllers/department.controller.js`**
   - Added `getStatistics` method

3. **`backend/src/services/department.service.js`**
   - Added `getStatistics` method with complex aggregation logic
   - Imports Student and Course models
   - Groups students by semester, section, and both

### Frontend
1. **`frontend/src/services/departmentService.js`**
   - Added `getStatistics(id)` method

2. **`frontend/src/pages/Admin/DepartmentManagement.jsx`**
   - Added React Query hook for statistics
   - Enhanced department details view
   - Added student statistics table
   - Shows total students and courses
   - Displays students grouped by semester and section

## How to Use

### Step 1: Navigate to Department Management
1. Login as admin
2. Go to Department Management page
3. Click on any department in the left panel

### Step 2: View Department Statistics
The right panel will show:
- Department basic info with student/course counts
- Student statistics organized by semester and section
- Detailed table for each semester-section combination

### Step 3: View Student Details
Each table shows:
- Enrollment numbers
- Student names
- Course codes
- Batch information
- Contact details

## Example View

```
┌─────────────────────────────────────────────────┐
│ Computer Science                                │
├─────────────────────────────────────────────────┤
│ Code: CSE          HOD: Dr. John Doe           │
│ Students: 150      Courses: 5                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ Students by Semester & Section                  │
├─────────────────────────────────────────────────┤
│ Semester 1 - Section A              [30 Students]│
│ ┌─────────────────────────────────────────────┐ │
│ │ Enroll No  │ Name      │ Course │ Batch    │ │
│ ├─────────────────────────────────────────────┤ │
│ │ 2023CSE001 │ John Doe  │ BTECH  │ 2023-27  │ │
│ │ 2023CSE002 │ Jane Smith│ BTECH  │ 2023-27  │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ Semester 1 - Section B              [28 Students]│
│ ┌─────────────────────────────────────────────┐ │
│ │ ...                                         │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Benefits

1. **Quick Overview**: See total student count at a glance
2. **Organized View**: Students grouped logically by semester and section
3. **Detailed Information**: All relevant student details in one place
4. **Easy Navigation**: Click department → See all students
5. **Real-time Data**: Statistics update automatically
6. **Responsive Design**: Works on all screen sizes

## Use Cases

1. **Department Head**: View all students under their department
2. **Admin**: Monitor student distribution across semesters/sections
3. **Planning**: Identify sections with too many/few students
4. **Contact**: Quick access to student contact information
5. **Reporting**: Export data for reports and analysis

## Future Enhancements (Optional)

- Export to Excel/PDF
- Filter by course, batch, or status
- Search within department students
- Click student to view full profile
- Add/remove students from department
- Bulk operations (assign section, move semester)

## Testing

### Test with Sample Data
1. Ensure students are assigned to departments
2. Students should have:
   - Department ID
   - Current Semester
   - Section
   - Course
3. Navigate to department view
4. Verify statistics display correctly

### Expected Behavior
- ✅ Shows "Loading statistics..." while fetching
- ✅ Displays total counts in department info
- ✅ Groups students by semester and section
- ✅ Shows "No students enrolled" if empty
- ✅ Tables are scrollable on small screens
- ✅ Data updates when switching departments

## Summary

The department module now provides a comprehensive view of all students in a department, organized by semester and section. This makes it easy for administrators to:
- Monitor student distribution
- Access student information quickly
- Plan section assignments
- Generate reports
- Manage department resources

**Status**: ✅ Complete and functional
**Date**: February 9, 2026
