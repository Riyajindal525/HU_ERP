import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './src/models/Student.js';
import Faculty from './src/models/Faculty.js';
import Course from './src/models/Course.js';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testDashboard = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📊 TESTING DASHBOARD DATA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Count Users
    const totalUsers = await User.countDocuments();
    const studentUsers = await User.countDocuments({ role: 'STUDENT' });
    const facultyUsers = await User.countDocuments({ role: 'FACULTY' });
    const adminUsers = await User.countDocuments({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } });

    console.log('👥 USER COUNTS:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Student Users: ${studentUsers}`);
    console.log(`   Faculty Users: ${facultyUsers}`);
    console.log(`   Admin Users: ${adminUsers}\n`);

    // Count Student Profiles
    const totalStudents = await Student.countDocuments({ isDeleted: false });
    const allStudents = await Student.countDocuments();
    
    console.log('🎓 STUDENT PROFILE COUNTS:');
    console.log(`   Active Students (isDeleted=false): ${totalStudents}`);
    console.log(`   All Students (including deleted): ${allStudents}\n`);

    // Count Faculty Profiles
    const totalFaculty = await Faculty.countDocuments({ isDeleted: false });
    const allFaculty = await Faculty.countDocuments();
    
    console.log('👨‍🏫 FACULTY PROFILE COUNTS:');
    console.log(`   Active Faculty (isDeleted=false): ${totalFaculty}`);
    console.log(`   All Faculty (including deleted): ${allFaculty}\n`);

    // Count Courses
    const activeCourses = await Course.countDocuments({ isDeleted: false, isActive: true });
    const allCourses = await Course.countDocuments({ isDeleted: false });
    
    console.log('📚 COURSE COUNTS:');
    console.log(`   Active Courses: ${activeCourses}`);
    console.log(`   All Courses: ${allCourses}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 DASHBOARD API RESPONSE WOULD BE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(JSON.stringify({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        activeCourses,
        attendanceRate: 0
      }
    }, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List recent users
    console.log('📝 RECENT USERS (Last 5):');
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('email role firstName lastName createdAt');
    
    recentUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.role}) - ${user.firstName} ${user.lastName}`);
      console.log(`      Created: ${user.createdAt}`);
    });

    // Check if Student/Faculty profiles exist for users
    console.log('\n🔍 CHECKING PROFILE CREATION:');
    for (const user of recentUsers) {
      if (user.role === 'STUDENT') {
        const studentProfile = await Student.findOne({ user: user._id });
        console.log(`   ${user.email}: ${studentProfile ? '✅ Has Student Profile' : '❌ NO Student Profile'}`);
      } else if (user.role === 'FACULTY') {
        const facultyProfile = await Faculty.findOne({ user: user._id });
        console.log(`   ${user.email}: ${facultyProfile ? '✅ Has Faculty Profile' : '❌ NO Faculty Profile'}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

testDashboard();
