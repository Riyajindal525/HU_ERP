import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Test credentials
const adminCredentials = {
  email: 'admin@erp.com',
  password: 'Admin@123'
};

let authToken = '';

async function testDepartments() {
  console.log('🧪 Testing Departments API...\n');

  try {
    // 1. Login
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, adminCredentials);
    authToken = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');
    console.log('Token:', authToken.substring(0, 20) + '...\n');

    // 2. Get all departments
    console.log('2️⃣ Fetching departments...');
    const deptResponse = await axios.get(`${API_URL}/departments`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Full Response:', JSON.stringify(deptResponse.data, null, 2));
    
    const departments = deptResponse.data.data;
    console.log(`\n✅ Found ${departments?.length || 0} departments:`);
    
    if (departments && departments.length > 0) {
      departments.forEach((dept, idx) => {
        console.log(`   ${idx + 1}. ${dept.name} (${dept.code}) - ID: ${dept._id}`);
      });
    } else {
      console.log('   ⚠️ No departments found in database!');
      console.log('   Run: node backend/scripts/seedDatabase.js');
    }

    // 3. Get all courses
    console.log('\n3️⃣ Fetching courses...');
    const courseResponse = await axios.get(`${API_URL}/courses?limit=100`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    console.log('Course Response:', JSON.stringify(courseResponse.data, null, 2));
    
    const courses = courseResponse.data.data?.courses || [];
    console.log(`\n✅ Found ${courses.length} courses:`);
    
    if (courses.length > 0) {
      courses.forEach((course, idx) => {
        console.log(`   ${idx + 1}. ${course.name} (${course.code})`);
        console.log(`      Department: ${course.department?.name || 'N/A'}`);
      });
    } else {
      console.log('   ⚠️ No courses found in database!');
    }

    console.log('\n✅ All tests completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDepartments();
