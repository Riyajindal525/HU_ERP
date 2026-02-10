const testConnection = async () => {
  console.log('🧪 Testing Backend Connection\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const backendUrl = 'http://localhost:5000';

  // Test 1: Health check
  console.log('1️⃣  Testing health endpoint...');
  try {
    const response = await fetch(`${backendUrl}/health`);
    const data = await response.json();
    console.log('✅ Health check passed');
    console.log('   Response:', data);
  } catch (error) {
    console.log('❌ Health check failed');
    console.log('   Error:', error.message);
    if (error.cause?.code === 'ECONNREFUSED') {
      console.log('\n   ⚠️  BACKEND IS NOT RUNNING!');
      console.log('   ⚠️  Start it with:');
      console.log('   ⚠️  cd FinalErp\\backend');
      console.log('   ⚠️  npm run dev\n');
    }
    return;
  }

  console.log('');

  // Test 2: API endpoint
  console.log('2️⃣  Testing API endpoint (send-otp)...');
  try {
    const response = await fetch(`${backendUrl}/api/v1/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({ email: 'test@test.com' })
    });
    const data = await response.json();
    console.log('✅ API endpoint accessible');
    console.log('   Status:', response.status);
    console.log('   Response:', data);
  } catch (error) {
    console.log('❌ API endpoint failed');
    console.log('   Error:', error.message);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Backend URL: http://localhost:5000');
  console.log('API URL: http://localhost:5000/api/v1');
  console.log('Frontend URL: http://localhost:5173');
  console.log('');
  console.log('✅ If all tests passed, the backend is working!');
  console.log('❌ If health check failed, START THE BACKEND FIRST:');
  console.log('   cd FinalErp\\backend');
  console.log('   npm run dev');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

testConnection();
