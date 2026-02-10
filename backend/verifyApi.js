import axios from 'axios';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api/v1';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('verify_log.txt', msg + '\n');
};

const testAdminFlow = async () => {
    // Clear previous log
    fs.writeFileSync('verify_log.txt', 'Starting Verification...\n');

    let token;
    let courseId;
    let subjectId;
    let facultyId;
    let studentId;

    try {
        log('=== Starting API Verification ===');

        // 1. Login as Admin
        log('\n1. Logging in as Admin...');
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'admin@test.com',
                password: 'password123'
            });
            token = loginRes.data.data.accessToken;
            log('✅ Login Successful');
        } catch (e) {
            log('❌ Login Failed: ' + (e.response?.data?.message || e.message));
            return;
        }

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create Course (if not exists)
        log('\n2. Creating/Fetching Course...');
        try {
            // First try to fetch
            const coursesRes = await axios.get(`${API_URL}/courses`, authHeaders);
            if (coursesRes.data.data.courses.length > 0) {
                courseId = coursesRes.data.data.courses[0]._id;
                log('✅ Found existing course: ' + coursesRes.data.data.courses[0].name);
            } else {
                // Create
                const newCourse = await axios.post(`${API_URL}/courses`, {
                    name: 'Computer Science ' + Date.now(),
                    code: 'CS' + Math.floor(Math.random() * 1000),
                    description: 'Test Course',
                    credits: 120,
                    duration: 4,
                    semesters: 8
                }, authHeaders);
                courseId = newCourse.data.data._id;
                log('✅ Created new course');
            }
        } catch (e) {
             log('⚠️ Course creation/fetch issue: ' + (e.response?.data?.message || e.message));
        }

        // 3. Create Subject
        if (courseId) {
            log('\n3. Creating Subject...');
            try {
                const subjectRes = await axios.post(`${API_URL}/subjects`, {
                    name: 'Data Structures ' + Date.now(),
                    code: 'CS201-' + Math.floor(Math.random() * 1000),
                    course: courseId,
                    semester: 3,
                    credits: 4,
                    type: 'THEORY'
                }, authHeaders);
                subjectId = subjectRes.data.data._id;
                log('✅ Subject Created: ' + subjectRes.data.data.name);
            } catch (e) {
                log('❌ Subject Creation Failed: ' + (e.response?.data?.message || e.message));
            }
        }

        // 4. Fetch Active Faculty
        log('\n4. Fetching Faculty...');
        try {
            const facultyRes = await axios.get(`${API_URL}/faculty`, authHeaders);
            const faculty = facultyRes.data.data.faculty;
            if (faculty.length > 0) {
                facultyId = faculty[0]._id;
                log('✅ Found Faculty: ' + faculty[0].firstName);
            } else {
                log('⚠️ No faculty found to test assignment');
            }
        } catch (e) {
            log('❌ Fetch Faculty Failed: ' + e.message);
        }

        // 5. Assign Subject to Faculty
        if (facultyId && subjectId) {
            log('\n5. Assigning Subject to Faculty...');
            try {
                const updateRes = await axios.put(`${API_URL}/faculty/${facultyId}`, {
                    allocatedSubjects: [{
                        subject: subjectId,
                        section: 'A',
                        semester: 3,
                        academicYear: '2025-26'
                    }]
                }, authHeaders);
                log('✅ Subject Assigned to Faculty');
            } catch (e) {
                log('❌ Faculty Assignment Failed: ' + (e.response?.data?.message || e.message));
            }
        }

        // 6. Fetch Students
        log('\n6. Fetching Students...');
        try {
            const studentsRes = await axios.get(`${API_URL}/students`, authHeaders);
            const students = studentsRes.data.data.students;
            if (students.length > 0) {
                studentId = students[0]._id;
                log('✅ Found Student: ' + students[0].firstName);
            } else {
                log('⚠️ No students found to test enrollment');
            }
        } catch (e) {
            log('❌ Fetch Students Failed: ' + e.message);
        }

        // 7. Enroll Student (Update Batch/Section)
        if (studentId && courseId) {
            log('\n7. Enrolling Student...');
            try {
                await axios.put(`${API_URL}/students/${studentId}`, {
                    course: courseId,
                    batch: '2024-2028',
                    section: 'B'
                }, authHeaders);
                log('✅ Student Enrolled with Batch/Section');
            } catch (e) {
                log('❌ Student Enrollment Failed: ' + (e.response?.data?.message || e.message));
            }
        }

        log('\n=== Verification Complete ===');

    } catch (error) {
        log('Global Error: ' + error);
    }
};

testAdminFlow();
