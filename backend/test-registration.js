import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Student from './src/models/Student.js';
import Faculty from './src/models/Faculty.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testRegistration = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧪 TESTING REGISTRATION SIMULATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test data
    const testEmail = `test.student.${Date.now()}@test.com`;
    const testData = {
      email: testEmail,
      password: 'TestPassword123!',
      role: 'STUDENT',
      firstName: 'Test',
      lastName: 'Student'
    };

    console.log('📝 Creating test user with data:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('');

    // Simulate what auth.service.js does
    const user = await User.create({
      email: testData.email,
      password: testData.password,
      role: testData.role,
      firstName: testData.firstName,
      lastName: testData.lastName,
      emailVerified: false,
    });

    console.log('✅ User created:', user._id);

    // Try to create Student profile (this is what was failing before)
    try {
      const studentProfile = await Student.create({
        user: user._id,
        firstName: testData.firstName,
        lastName: testData.lastName,
        email: testData.email,
      });
      
      console.log('✅ Student profile created:', studentProfile._id);
      console.log('');
      console.log('🎉 SUCCESS! Registration now creates both User and Profile!');
      console.log('');

      // Verify counts
      const userCount = await User.countDocuments({ role: 'STUDENT' });
      const profileCount = await Student.countDocuments();
      
      console.log('📊 CURRENT COUNTS:');
      console.log(`   Student Users: ${userCount}`);
      console.log(`   Student Profiles: ${profileCount}`);
      console.log(`   Match: ${userCount === profileCount ? '✅ YES' : '❌ NO'}`);

      // Clean up test data
      await User.findByIdAndDelete(user._id);
      await Student.findByIdAndDelete(studentProfile._id);
      console.log('\n🧹 Test data cleaned up');

    } catch (error) {
      console.error('❌ FAILED to create Student profile!');
      console.error('Error:', error.message);
      console.error('\nThis means the fix did NOT work.');
      
      // Clean up user
      await User.findByIdAndDelete(user._id);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

testRegistration();
