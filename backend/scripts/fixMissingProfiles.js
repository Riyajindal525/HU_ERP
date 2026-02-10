import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Student from '../src/models/Student.js';
import Faculty from '../src/models/Faculty.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const fixMissingProfiles = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔍 Finding users without profiles...\n');

    // Find all Student users
    const studentUsers = await User.find({ role: 'STUDENT' });
    console.log(`📚 Found ${studentUsers.length} Student users`);

    let studentsFixed = 0;
    for (const user of studentUsers) {
      const profile = await Student.findOne({ user: user._id });
      if (!profile) {
        console.log(`   ❌ Missing profile for: ${user.email}`);
        
        // Create profile
        await Student.create({
          user: user._id,
          firstName: user.firstName || 'Unknown',
          lastName: user.lastName || 'User',
          email: user.email,
        });
        
        console.log(`   ✅ Created profile for: ${user.email}`);
        studentsFixed++;
      }
    }

    // Find all Faculty users
    const facultyUsers = await User.find({ role: 'FACULTY' });
    console.log(`\n👨‍🏫 Found ${facultyUsers.length} Faculty users`);

    let facultyFixed = 0;
    for (const user of facultyUsers) {
      const profile = await Faculty.findOne({ user: user._id });
      if (!profile) {
        console.log(`   ❌ Missing profile for: ${user.email}`);
        
        // Create profile
        await Faculty.create({
          user: user._id,
          firstName: user.firstName || 'Unknown',
          lastName: user.lastName || 'User',
          email: user.email,
        });
        
        console.log(`   ✅ Created profile for: ${user.email}`);
        facultyFixed++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Fixed ${studentsFixed} Student profiles`);
    console.log(`✅ Fixed ${facultyFixed} Faculty profiles`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify final counts
    const finalStudentUsers = await User.countDocuments({ role: 'STUDENT' });
    const finalStudentProfiles = await Student.countDocuments();
    const finalFacultyUsers = await User.countDocuments({ role: 'FACULTY' });
    const finalFacultyProfiles = await Faculty.countDocuments();

    console.log('📊 FINAL COUNTS:');
    console.log(`   Student Users: ${finalStudentUsers}`);
    console.log(`   Student Profiles: ${finalStudentProfiles}`);
    console.log(`   Match: ${finalStudentUsers === finalStudentProfiles ? '✅ YES' : '❌ NO'}`);
    console.log('');
    console.log(`   Faculty Users: ${finalFacultyUsers}`);
    console.log(`   Faculty Profiles: ${finalFacultyProfiles}`);
    console.log(`   Match: ${finalFacultyUsers === finalFacultyProfiles ? '✅ YES' : '❌ NO'}`);
    console.log('');

    if (finalStudentUsers === finalStudentProfiles && finalFacultyUsers === finalFacultyProfiles) {
      console.log('🎉 ALL PROFILES FIXED! Dashboard will now show correct counts!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

fixMissingProfiles();
