/**
 * Test script for admin creating student and faculty accounts
 * 
 * Usage:
 * 1. Make sure backend is running (npm start)
 * 2. Login as admin to get access token
 * 3. Replace ACCESS_TOKEN below with your admin token
 * 4. Run: node test-admin-create-accounts.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';

// Replace with your admin access token
const ACCESS_TOKEN = 'YOUR_ADMIN_TOKEN_HERE';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ACCESS_TOKEN}`
  }
});

async function testCreateStudent() {
  console.log('\n=== Testing Create Student ===');
  try {
    const response = await api.post('/students', {
      firstName: 'Test',
      lastName: 'Student',
      email: `test.student.${Date.now()}@huroorkee.ac.in`,
      role: 'STUDENT'
    });

    console.log('✅ Student created successfully');
    console.log('Student ID:', response.data.data.student._id);
    console.log('Temporary Password:', response.data.data.tempPassword);
    console.log('Email:', response.data.data.user.email);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create student');
    console.error('Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.error('⚠️  Authentication failed. Please update ACCESS_TOKEN in this script.');
    }
    throw error;
  }
}

async function testCreateFaculty() {
  console.log('\n=== Testing Create Faculty ===');
  try {
    const response = await api.post('/faculty', {
      firstName: 'Test',
      lastName: 'Faculty',
      email: `test.faculty.${Date.now()}@huroorkee.ac.in`,
      role: 'FACULTY'
    });

    console.log('✅ Faculty created successfully');
    console.log('Faculty ID:', response.data.data.faculty._id);
    console.log('Temporary Password:', response.data.data.tempPassword);
    console.log('Email:', response.data.data.user.email);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to create faculty');
    console.error('Error:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.error('⚠️  Authentication failed. Please update ACCESS_TOKEN in this script.');
    }
    throw error;
  }
}

async function testLoginWithOtp(email, otp) {
  console.log('\n=== Testing Login with OTP ===');
  try {
    const response = await axios.post(`${API_URL}/auth/login-with-otp`, {
      email,
      otp
    });

    console.log('✅ Login successful');
    console.log('User Role:', response.data.data.user.role);
    console.log('Access Token:', response.data.data.accessToken.substring(0, 20) + '...');
    return response.data;
  } catch (error) {
    console.error('❌ Login failed');
    console.error('Error:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Starting Admin Account Creation Tests');
  console.log('API URL:', API_URL);

  if (ACCESS_TOKEN === 'YOUR_ADMIN_TOKEN_HERE') {
    console.error('\n❌ ERROR: Please update ACCESS_TOKEN in this script');
    console.error('Steps to get token:');
    console.error('1. Login as admin at http://localhost:3000/login');
    console.error('2. Open browser console');
    console.error('3. Run: localStorage.getItem("accessToken")');
    console.error('4. Copy the token and paste it in this script');
    process.exit(1);
  }

  try {
    // Test creating student
    const studentData = await testCreateStudent();
    
    // Test creating faculty
    const facultyData = await testCreateFaculty();

    console.log('\n✅ All tests passed!');
    console.log('\n📝 Summary:');
    console.log('- Student created:', studentData.data.user.email);
    console.log('- Faculty created:', facultyData.data.user.email);
    console.log('\n💡 Next steps:');
    console.log('1. Check backend console for temporary passwords');
    console.log('2. Test OTP login with created accounts');
    console.log('3. Verify accounts appear in admin dashboard');

  } catch (error) {
    console.error('\n❌ Tests failed');
    process.exit(1);
  }
}

// Run tests
runTests();
