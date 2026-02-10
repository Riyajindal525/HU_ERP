# Faculty Assignment Redirect Feature

## Overview
When an admin clicks "Assign Faculty" in the Subject Management page, they are now redirected to the Faculty Management page where they can select a faculty member and assign the subject to them.

## How It Works

### User Flow

1. **Admin goes to Subject Management**
   - Views list of all subjects
   - Sees "Assign Faculty" button (green UserPlus icon) for each subject

2. **Admin clicks "Assign Faculty" on a subject**
   - Gets redirected to Faculty Management page
   - Sees a success toast: "Select a faculty member to assign [Subject Name]"
   - The "Allocate Subjects" buttons (BookOpen icon) are highlighted in green and pulsing

3. **Admin clicks "Allocate Subjects" on any faculty member**
   - Modal opens with the subject pre-selected
   - Course and Semester fields are pre-filled and disabled
   - Subject field shows the selected subject and is disabled
   - Admin only needs to enter Section and Academic Year

4. **Admin submits the form**
   - Subject is assigned to the faculty member
   - Success toast appears
   - Faculty table updates to show the new assignment

## Technical Implementation

### Subject Management Changes

**File**: `frontend/src/pages/Admin/SubjectManagement.jsx`

**Changes**:
1. Added `useNavigate` hook from react-router-dom
2. Removed faculty assignment modal
3. Removed faculty assignment mutations
4. Updated "Assign Faculty" button to navigate instead of opening modal:
   ```javascript
   navigate('/admin/faculty', { 
       state: { 
           assignSubject: true,
           subjectId: subject._id,
           subjectName: subject.name,
           subjectCode: subject.code,
           courseId: subject.course?._id,
           semester: subject.semester
       } 
   });
   ```
5. Removed unassign faculty button from table (now managed in Faculty Management)

### Faculty Management Changes

**File**: `frontend/src/pages/Admin/FacultyManagement.jsx`

**Changes**:
1. Added `useLocation` hook to receive navigation state
2. Added `preSelectedSubject` state to store the subject from navigation
3. Added `useEffect` to check for incoming subject assignment:
   ```javascript
   useEffect(() => {
       if (location.state?.assignSubject) {
           setPreSelectedSubject({
               id: location.state.subjectId,
               name: location.state.subjectName,
               code: location.state.subjectCode,
               courseId: location.state.courseId,
               semester: location.state.semester
           });
           toast.success(`Select a faculty member to assign "${location.state.subjectName}"`, {
               duration: 5000
           });
       }
   }, [location.state]);
   ```
4. Updated "Allocate Subjects" button to highlight when subject is pre-selected:
   ```javascript
   className={`p-1 hover:bg-blue-50 rounded ${
       preSelectedSubject ? 'text-green-600 animate-pulse' : 'text-blue-600'
   }`}
   ```
5. Updated `AssignSubjectModal` to accept and use `preSelectedSubject` prop
6. Modal shows green info box when subject is pre-selected
7. Course, Semester, and Subject fields are disabled when pre-selected
8. Clear pre-selected subject after assignment or modal close

### AssignSubjectModal Changes

**Changes**:
1. Added `preSelectedSubject` prop
2. Initialize `selectedCourse` and `selectedSemester` from pre-selected subject
3. Show green info box when subject is pre-selected
4. Disable Course, Semester, and Subject fields when pre-selected
5. Pre-populate Subject dropdown with the selected subject

## Benefits

### 1. Better User Experience
- Single workflow for faculty assignment
- Clear visual feedback (pulsing green buttons)
- Guided process with toast notifications
- Less confusion about where to assign faculty

### 2. Consistency
- All faculty assignments happen in one place (Faculty Management)
- Easier to see all subjects assigned to a faculty member
- Centralized management of faculty workload

### 3. Flexibility
- Admin can still manually assign subjects in Faculty Management
- Pre-selection is optional - admin can change course/semester if needed
- Works seamlessly with existing faculty management features

## Visual Indicators

### Subject Management
- Green UserPlus icon for "Assign Faculty" button
- Tooltip: "Assign Faculty"
- Faculty column shows assigned faculty (read-only)

### Faculty Management (After Redirect)
- Success toast at top: "Select a faculty member to assign [Subject Name]"
- BookOpen icons turn green and pulse
- Tooltip: "Allocated Subjects"

### Assignment Modal
- Green info box showing: "Assigning: [Subject Name] ([Subject Code])"
- Course, Semester, and Subject fields are disabled and pre-filled
- Only Section and Academic Year need to be entered

## Example Workflow

```
Subject Management Page
├── Click "Assign Faculty" on "Data Structures (CS201)"
│
└── Redirects to Faculty Management Page
    ├── Toast: "Select a faculty member to assign Data Structures"
    ├── BookOpen buttons are green and pulsing
    │
    └── Click BookOpen on "Dr. John Smith"
        ├── Modal opens
        ├── Shows: "Assigning: Data Structures (CS201)"
        ├── Course: B.Tech CS (disabled)
        ├── Semester: 3 (disabled)
        ├── Subject: Data Structures (CS201) (disabled)
        ├── Section: [Enter A, B, C...]
        ├── Academic Year: [2025-26]
        │
        └── Click "Allocate"
            ├── Subject assigned to faculty
            ├── Toast: "Faculty updated successfully"
            └── Table updates to show assignment
```

## Code Flow

```
SubjectManagement.jsx
    ↓ (Click Assign Faculty)
    navigate('/admin/faculty', { state: { ...subjectInfo } })
    ↓
FacultyManagement.jsx
    ↓ (useEffect detects location.state)
    setPreSelectedSubject(subjectInfo)
    toast.success("Select a faculty member...")
    ↓ (Click Allocate Subjects on faculty)
    setShowSubjectModal(true)
    ↓
AssignSubjectModal
    ↓ (Receives preSelectedSubject prop)
    Pre-fills Course, Semester, Subject
    Disables those fields
    Shows green info box
    ↓ (Admin enters Section and Year)
    onSubmit(data)
    ↓
updateFacultyMutation
    ↓ (Success)
    toast.success("Faculty updated successfully")
    Clear preSelectedSubject
```

## API Calls

### Subject Management
- `GET /api/v1/subjects` - Fetch all subjects with filters
- `GET /api/v1/departments` - Fetch departments for filters
- `GET /api/v1/courses` - Fetch courses for filters

### Faculty Management
- `GET /api/v1/faculty` - Fetch all faculty members
- `GET /api/v1/courses` - Fetch courses for dropdown
- `GET /api/v1/subjects` - Fetch subjects for selected course/semester
- `PUT /api/v1/faculty/:id` - Update faculty with new subject assignment

## State Management

### Navigation State (React Router)
```javascript
{
    assignSubject: true,
    subjectId: '...',
    subjectName: 'Data Structures',
    subjectCode: 'CS201',
    courseId: '...',
    semester: 3
}
```

### Component State
```javascript
// FacultyManagement.jsx
const [preSelectedSubject, setPreSelectedSubject] = useState(null);

// AssignSubjectModal
const [selectedCourse, setSelectedCourse] = useState(preSelectedSubject?.courseId || '');
const [selectedSemester, setSelectedSemester] = useState(preSelectedSubject?.semester?.toString() || '');
```

## Testing

### Manual Testing Steps

1. **Test Normal Assignment**:
   - Go to Subject Management
   - Click "Assign Faculty" on any subject
   - Verify redirect to Faculty Management
   - Verify toast message appears
   - Verify buttons are highlighted
   - Click on a faculty member's BookOpen button
   - Verify modal opens with pre-filled data
   - Enter section and year
   - Submit and verify assignment

2. **Test Manual Assignment**:
   - Go directly to Faculty Management
   - Click BookOpen on any faculty
   - Verify modal opens normally (no pre-selection)
   - Select course, semester, subject manually
   - Submit and verify assignment

3. **Test Cancel**:
   - Go to Subject Management
   - Click "Assign Faculty"
   - Click BookOpen on faculty
   - Click Cancel
   - Verify pre-selection is cleared
   - Click BookOpen again
   - Verify no pre-selection

## Future Enhancements

1. **Bulk Assignment**: Assign one subject to multiple faculty members
2. **Workload View**: Show faculty workload before assignment
3. **Conflict Detection**: Warn if faculty already has too many subjects
4. **Time Slot Integration**: Consider timetable when assigning
5. **Department Filter**: Filter faculty by department when assigning
6. **History**: Track assignment history and changes

## Troubleshooting

### Issue: Redirect doesn't work
**Solution**: Check that react-router-dom is installed and routes are configured

### Issue: Pre-selection doesn't show
**Solution**: Check browser console for state data, verify location.state is passed

### Issue: Modal doesn't open automatically
**Solution**: This is by design - admin must select which faculty member to assign to

### Issue: Can't change pre-selected subject
**Solution**: This is by design - go back to Subject Management to select different subject

## Summary

This feature provides a seamless workflow for assigning faculty to subjects:
- ✅ Click "Assign Faculty" in Subject Management
- ✅ Redirect to Faculty Management with subject info
- ✅ Visual indicators guide the admin
- ✅ Pre-filled form reduces data entry
- ✅ Centralized faculty management
- ✅ Consistent user experience

The implementation uses React Router's navigation state to pass subject information between pages, providing a smooth and intuitive user experience.
