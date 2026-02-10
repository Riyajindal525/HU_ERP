import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './src/models/Student.js';
import Department from './src/models/Department.js';
import Course from './src/models/Course.js';

dotenv.config();

async function verifyStudents() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all departments
    const departments = await Department.find();
    console.log(`📋 Found ${departments.length} departments\n`);

    // Get all students
    const students = await Student.find()
      .populate('department', 'name code')
      .populate('course', 'name code')
      .select('firstName lastName email department course batch section currentSemester status');

    console.log(`👥 Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('⚠️  No students found in database!\n');
    } else {
      console.log('Student Details:\n');
      students.forEach((student, index) => {
        console.log(`${index + 1}. ${student.firstName} ${student.lastName}`);
        console.log(`   Email: ${student.email}`);
        console.log(`   Department: ${student.department ? `${student.department.name} (${student.department.code})` : '❌ NOT ASSIGNED'}`);
        console.log(`   Course: ${student.course ? `${student.course.name} (${student.course.code})` : '❌ NOT ASSIGNED'}`);
        console.log(`   Batch: ${student.batch || 'N/A'}`);
        console.log(`   Section: ${student.section || 'N/A'}`);
        console.log(`   Semester: ${student.currentSemester || 'N/A'}`);
        console.log(`   Status: ${student.status}`);
        console.log(`   Department ID: ${student.department?._id || 'NULL'}`);
        console.log('');
      });
    }

    // Check students by department
    console.log('\n📊 Students by Department:\n');
    for (const dept of departments) {
      const deptStudents = await Student.find({ 
        department: dept._id,
        status: 'ACTIVE'
      });
      console.log(`${dept.name} (${dept.code}): ${deptStudents.length} students`);
      if (deptStudents.length > 0) {
        deptStudents.forEach(s => {
          console.log(`  - ${s.firstName} ${s.lastName}`);
        });
      }
    }

    console.log('\n✅ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyStudents();
