import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

async function quickTest() {
  try {
    // First, let's just check if we can reach the departments endpoint
    console.log('Testing departments endpoint without auth...');
    
    try {
      const response = await axios.get(`${API_URL}/departments`);
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Endpoint exists but requires authentication (expected)');
        console.log('Error:', error.response.data);
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    // Test health endpoint
    console.log('\nTesting health endpoint...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running:', health.data);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickTest();
