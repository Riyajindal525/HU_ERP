import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Test credentials
const adminCredentials = {
  email: 'admin@erp.com',
  password: 'Admin@123'
};

let authToken = '';
let testSubjectId = '';
let testFacultyId = '';

// Helper function to make authenticated requests
const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

async function runTests() {
  console.log('🚀 Starting Subject Management Tests...\n');

  try {
    // 1. Login as admin
    console.log('1️⃣ Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Login successful\n');

    // 2. Get all departments
    console.log('2️⃣ Fetching departments...');
    const deptResponse = await apiCall('GET', '/departments');
    const departments = deptResponse.data;
    console.log(`✅ Found ${departments.length} departments`);
    if (departments.length > 0) {
      console.log(`   First department: ${departments[0].name} (${departments[0]._id})\n`);
    }

    // 3. Get all courses
    console.log('3️⃣ Fetching courses...');
    const courseResponse = await apiCall('GET', '/courses');
    const courses = courseResponse.courses || courseResponse.data;
    console.log(`✅ Found ${courses.length} courses`);
    if (courses.length > 0) {
      console.log(`   First course: ${courses[0].name} (${courses[0]._id})`);
      console.log(`   Department: ${courses[0].department?.name || courses[0].department}\n`);
    }

    // 4. Get all faculty
    console.log('4️⃣ Fetching faculty...');
    const facultyResponse = await apiCall('GET', '/faculty');
    const faculty = facultyResponse.data;
    console.log(`✅ Found ${faculty.length} faculty members`);
    if (faculty.length > 0) {
      testFacultyId = faculty[0]._id;
      console.log(`   First faculty: ${faculty[0].name} (${faculty[0]._id})\n`);
    }

    // 5. Create a test subject
    if (departments.length > 0 && courses.length > 0) {
      console.log('5️⃣ Creating a test subject...');
      const subjectData = {
        name: 'Test Subject - Data Structures',
        code: 'TEST-DS-' + Date.now(),
        department: departments[0]._id,
        course: courses[0]._id,
        semester: 3,
        credits: 4,
        type: 'THEORY',
        description: 'Test subject for subject management'
      };
      
      const createResponse = await apiCall('POST', '/subjects', subjectData);
      testSubjectId = createResponse.data._id;
      console.log('✅ Subject created successfully');
      console.log(`   Subject ID: ${testSubjectId}`);
      console.log(`   Name: ${createResponse.data.name}`);
      console.log(`   Code: ${createResponse.data.code}\n`);
    }

    // 6. Get all subjects
    console.log('6️⃣ Fetching all subjects...');
    const subjectsResponse = await apiCall('GET', '/subjects');
    const subjects = subjectsResponse.data;
    console.log(`✅ Found ${subjects.length} subjects`);
    subjects.slice(0, 3).forEach(subject => {
      console.log(`   - ${subject.name} (${subject.code})`);
      console.log(`     Department: ${subject.department?.name || 'N/A'}`);
      console.log(`     Course: ${subject.course?.name || 'N/A'}`);
      console.log(`     Semester: ${subject.semester}, Credits: ${subject.credits}`);
    });
    console.log('');

    // 7. Filter subjects by department
    if (departments.length > 0) {
      console.log('7️⃣ Filtering subjects by department...');
      const filteredResponse = await apiCall('GET', `/subjects?department=${departments[0]._id}`);
      const filteredSubjects = filteredResponse.data;
      console.log(`✅ Found ${filteredSubjects.length} subjects in ${departments[0].name}\n`);
    }

    // 8. Assign faculty to subject
    if (testSubjectId && testFacultyId) {
      console.log('8️⃣ Assigning faculty to subject...');
      const assignData = {
        facultyId: testFacultyId,
        section: 'A',
        academicYear: '2024-2025'
      };
      
      const assignResponse = await apiCall('POST', `/subjects/${testSubjectId}/assign-faculty`, assignData);
      console.log('✅ Faculty assigned successfully');
      console.log(`   Faculty: ${assignResponse.data.facultyAssigned[0]?.faculty?.name || 'N/A'}`);
      console.log(`   Section: ${assignResponse.data.facultyAssigned[0]?.section || 'N/A'}\n`);
    }

    // 9. Get subject with faculty details
    if (testSubjectId) {
      console.log('9️⃣ Fetching subject with faculty details...');
      const subjectResponse = await apiCall('GET', `/subjects/${testSubjectId}`);
      const subject = subjectResponse.data;
      console.log('✅ Subject details:');
      console.log(`   Name: ${subject.name}`);
      console.log(`   Department: ${subject.department?.name || 'N/A'}`);
      console.log(`   Course: ${subject.course?.name || 'N/A'}`);
      console.log(`   Faculty Assigned: ${subject.facultyAssigned?.length || 0}`);
      if (subject.facultyAssigned && subject.facultyAssigned.length > 0) {
        subject.facultyAssigned.forEach(fa => {
          console.log(`     - ${fa.faculty?.name || 'N/A'} (Section: ${fa.section || 'N/A'})`);
        });
      }
      console.log('');
    }

    // 10. Update subject
    if (testSubjectId) {
      console.log('🔟 Updating subject...');
      const updateData = {
        credits: 5,
        description: 'Updated test subject description'
      };
      
      const updateResponse = await apiCall('PUT', `/subjects/${testSubjectId}`, updateData);
      console.log('✅ Subject updated successfully');
      console.log(`   New credits: ${updateResponse.data.credits}\n`);
    }

    // 11. Unassign faculty
    if (testSubjectId && testFacultyId) {
      console.log('1️⃣1️⃣ Unassigning faculty from subject...');
      await apiCall('DELETE', `/subjects/${testSubjectId}/unassign-faculty/${testFacultyId}`);
      console.log('✅ Faculty unassigned successfully\n');
    }

    // 12. Delete subject
    if (testSubjectId) {
      console.log('1️⃣2️⃣ Deleting test subject...');
      await apiCall('DELETE', `/subjects/${testSubjectId}`);
      console.log('✅ Subject deleted successfully\n');
    }

    console.log('✅ All tests completed successfully! 🎉');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
runTests();
