import axios from 'axios';
import readline from 'readline';

const API_URL = 'http://localhost:5000/api/v1';

// Test admin credentials
const ADMIN_EMAIL = 'rramteke2003@gmail.com';

async function testDepartmentAPI() {
  try {
    console.log('🧪 Testing Department API...\n');

    // Step 1: Login to get token
    console.log('1️⃣ Sending OTP to admin email...');
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      email: ADMIN_EMAIL
    });
    console.log('✅ OTP sent:', otpResponse.data);
    
    // Get OTP from console (you'll need to check backend terminal)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const otp = await new Promise(resolve => {
      rl.question('\n📧 Enter the OTP from backend terminal: ', answer => {
        rl.close();
        resolve(answer);
      });
    });

    console.log('\n2️⃣ Logging in with OTP...');
    const loginResponse = await axios.post(`${API_URL}/auth/login-with-otp`, {
      email: ADMIN_EMAIL,
      otp: otp.trim()
    });
    console.log('✅ Login successful');
    
    const token = loginResponse.data.data.accessToken;
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // Step 2: Create a test department
    console.log('\n3️⃣ Creating test department...');
    const createResponse = await axios.post(
      `${API_URL}/departments`,
      {
        name: 'Computer Science',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        hodName: 'Dr. John Doe'
      },
      config
    );
    console.log('✅ Department created:', createResponse.data);

    // Step 3: Get all departments
    console.log('\n4️⃣ Fetching all departments...');
    const getAllResponse = await axios.get(`${API_URL}/departments`, config);
    console.log('✅ Departments:', JSON.stringify(getAllResponse.data, null, 2));

    // Step 4: Get department by ID
    if (getAllResponse.data.data.length > 0) {
      const deptId = getAllResponse.data.data[0]._id;
      console.log(`\n5️⃣ Fetching department by ID: ${deptId}...`);
      const getByIdResponse = await axios.get(`${API_URL}/departments/${deptId}`, config);
      console.log('✅ Department details:', getByIdResponse.data);

      // Step 5: Update department
      console.log(`\n6️⃣ Updating department ${deptId}...`);
      const updateResponse = await axios.put(
        `${API_URL}/departments/${deptId}`,
        {
          description: 'Updated description for CSE department'
        },
        config
      );
      console.log('✅ Department updated:', updateResponse.data);
    }

    console.log('\n✅ All tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testDepartmentAPI();
