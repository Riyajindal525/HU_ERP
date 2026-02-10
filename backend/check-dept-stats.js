import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './src/models/Department.js';
import Student from './src/models/Student.js';
import Course from './src/models/Course.js';

dotenv.config();

async function checkDeptStats() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all departments
    const departments = await Department.find().sort({ name: 1 });
    
    console.log(`📋 Found ${departments.length} departments:\n`);

    for (const dept of departments) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📁 ${dept.name} (${dept.code})`);
      console.log(`   ID: ${dept._id}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      // Get students in this department
      const students = await Student.find({ 
        department: dept._id,
        status: 'ACTIVE'
      })
      .populate('course', 'name code')
      .select('firstName lastName enrollmentNumber currentSemester section batch');

      console.log(`   👥 Students: ${students.length}`);
      
      if (students.length > 0) {
        students.forEach((student, idx) => {
          console.log(`   ${idx + 1}. ${student.firstName} ${student.lastName}`);
          console.log(`      Enrollment: ${student.enrollmentNumber || 'N/A'}`);
          console.log(`      Course: ${student.course?.name || 'N/A'}`);
          console.log(`      Semester: ${student.currentSemester}, Section: ${student.section || 'N/A'}`);
          console.log(`      Batch: ${student.batch || 'N/A'}`);
        });
      } else {
        console.log(`   ⚠️  No students in this department`);
      }

      // Get courses in this department
      const courses = await Course.find({ 
        department: dept._id,
        isActive: true
      }).select('name code');

      console.log(`\n   📚 Courses: ${courses.length}`);
      if (courses.length > 0) {
        courses.forEach((course, idx) => {
          console.log(`   ${idx + 1}. ${course.name} (${course.code})`);
        });
      }
    }

    console.log('\n\n✅ Check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkDeptStats();
