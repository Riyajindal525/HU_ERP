import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';
const DEPT_ID = '698987c9b0d0cb3dceace2c8'; // mtech department ID

async function testDeptAPI() {
  try {
    console.log('🧪 Testing Department Statistics API...\n');
    console.log(`Department ID: ${DEPT_ID}\n`);

    // Test without auth (should fail)
    console.log('1️⃣ Testing without authentication...');
    try {
      const response = await axios.get(`${API_URL}/departments/${DEPT_ID}/statistics`);
      console.log('❌ Should have failed but got:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication\n');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('2️⃣ To test with authentication:');
    console.log('   - Login to the frontend');
    console.log('   - Open browser console (F12)');
    console.log('   - Get token: localStorage.getItem("accessToken")');
    console.log('   - Then run:');
    console.log(`   curl -H "Authorization: Bearer YOUR_TOKEN" ${API_URL}/departments/${DEPT_ID}/statistics`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testDeptAPI();
