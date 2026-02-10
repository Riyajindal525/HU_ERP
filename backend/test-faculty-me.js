import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api/v1';

async function testFacultyMe() {
    try {
        console.log('🧪 Testing Faculty /me endpoint\n');

        // First, login as faculty
        console.log('1️⃣ Logging in as faculty...');
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'rahulramtekehu@gmail.com',
            password: 'TempPass@123'
        });

        const token = loginResponse.data.data.token;
        console.log('✅ Login successful\n');

        // Test /faculty/me endpoint
        console.log('2️⃣ Fetching faculty profile...');
        const meResponse = await axios.get(`${API_URL}/faculty/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Faculty profile fetched\n');
        console.log('📊 Response Data:');
        console.log(JSON.stringify(meResponse.data, null, 2));

        console.log('\n📚 Allocated Subjects:');
        if (meResponse.data.data.allocatedSubjects && meResponse.data.data.allocatedSubjects.length > 0) {
            meResponse.data.data.allocatedSubjects.forEach((allocation, idx) => {
                console.log(`\n${idx + 1}. Subject: ${allocation.subject?.name || 'N/A'}`);
                console.log(`   Code: ${allocation.subject?.code || 'N/A'}`);
                console.log(`   Semester: ${allocation.semester || 'N/A'}`);
                console.log(`   Section: ${allocation.section || 'N/A'}`);
                console.log(`   Academic Year: ${allocation.academicYear || 'N/A'}`);
            });
        } else {
            console.log('❌ No subjects found in allocatedSubjects array');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.log('\nFull error response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testFacultyMe();
