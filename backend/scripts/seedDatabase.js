import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import Student from '../src/models/Student.js';
import Faculty from '../src/models/Faculty.js';
import Department from '../src/models/Department.js';
import Course from '../src/models/Course.js';
import Subject from '../src/models/Subject.js';
import Exam from '../src/models/Exam.js';
import Result from '../src/models/Result.js';
import Attendance from '../src/models/Attendance.js';
import Fee from '../src/models/Fee.js';
import logger from '../src/utils/logger.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Department.deleteMany({});
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await Exam.deleteMany({});
    await Result.deleteMany({});
    await Attendance.deleteMany({});
    await Fee.deleteMany({});

    // 1. Create Admin User
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      email: 'admin@haridwar.edu',
      firstName: 'Admin',
      lastName: 'User',
      password: 'Admin@123',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    });
    console.log('✅ Admin created:', adminUser.email);

    // 2. Create Departments
    console.log('🏢 Creating departments...');
    const departments = await Department.insertMany([
      {
        name: 'Computer Science & Engineering',
        code: 'CSE',
        description: 'Department of Computer Science and Engineering',
        head: null,
        isActive: true,
      },
      {
        name: 'Electronics & Communication',
        code: 'ECE',
        description: 'Department of Electronics and Communication Engineering',
        head: null,
        isActive: true,
      },
      {
        name: 'Mechanical Engineering',
        code: 'ME',
        description: 'Department of Mechanical Engineering',
        head: null,
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${departments.length} departments`);

    // 3. Create Courses
    console.log('📚 Creating courses...');
    const courses = await Course.insertMany([
      {
        name: 'Bachelor of Technology in Computer Science',
        code: 'BTECH-CSE',
        department: departments[0]._id,
        degree: 'B_TECH',
        duration: {
          years: 4,
          semesters: 8,
        },
        description: '4-year undergraduate program in Computer Science',
        eligibility: '10+2 with Physics, Chemistry, and Mathematics',
        totalSeats: 60,
        feeStructure: {
          tuitionFee: 50000,
          labFee: 5000,
          libraryFee: 2000,
          otherFees: 3000,
        },
        isActive: true,
      },
      {
        name: 'Bachelor of Technology in Electronics',
        code: 'BTECH-ECE',
        department: departments[1]._id,
        degree: 'B_TECH',
        duration: {
          years: 4,
          semesters: 8,
        },
        description: '4-year undergraduate program in Electronics',
        eligibility: '10+2 with Physics, Chemistry, and Mathematics',
        totalSeats: 60,
        feeStructure: {
          tuitionFee: 50000,
          labFee: 5000,
          libraryFee: 2000,
          otherFees: 3000,
        },
        isActive: true,
      },
    ]);
    console.log(`✅ Created ${courses.length} courses`);

    // 4. Create Subjects
    console.log('📖 Creating subjects...');
    const subjects = await Subject.insertMany([
      {
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        course: courses[0]._id,
        department: departments[0]._id,
        semester: 3,
        credits: 4,
        type: 'THEORY',
        description: 'Introduction to data structures and algorithms',
      },
      {
        name: 'Database Management Systems',
        code: 'CS301',
        course: courses[0]._id,
        department: departments[0]._id,
        semester: 5,
        credits: 4,
        type: 'THEORY',
        description: 'Fundamentals of database systems',
      },
      {
        name: 'Web Development',
        code: 'CS302',
        course: courses[0]._id,
        department: departments[0]._id,
        semester: 5,
        credits: 3,
        type: 'PRACTICAL',
        description: 'Full stack web development',
      },
      {
        name: 'Operating Systems',
        code: 'CS401',
        course: courses[0]._id,
        department: departments[0]._id,
        semester: 7,
        credits: 4,
        type: 'THEORY',
        description: 'Operating system concepts and design',
      },
    ]);
    console.log(`✅ Created ${subjects.length} subjects`);

    // 5. Create Faculty Users and Profiles
    console.log('👨‍🏫 Creating faculty...');
    const facultyUser1 = await User.create({
      email: 'faculty1@haridwar.edu',
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      password: 'Faculty@123',
      role: 'FACULTY',
      emailVerified: true,
      isActive: true,
    });

    const faculty1 = await Faculty.create({
      user: facultyUser1._id,
      employeeId: 'FAC001',
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'MALE',
      phone: '9876543210',
      department: departments[0]._id,
      designation: 'PROFESSOR',
      qualification: 'PHD',
      specialization: 'Data Structures, Algorithms',
      experience: 15,
      joiningDate: new Date('2010-07-01'),
    });

    const facultyUser2 = await User.create({
      email: 'faculty2@haridwar.edu',
      firstName: 'Dr. Priya',
      lastName: 'Sharma',
      password: 'Faculty@123',
      role: 'FACULTY',
      emailVerified: true,
      isActive: true,
    });

    const faculty2 = await Faculty.create({
      user: facultyUser2._id,
      employeeId: 'FAC002',
      firstName: 'Dr. Priya',
      lastName: 'Sharma',
      dateOfBirth: new Date('1985-08-20'),
      gender: 'FEMALE',
      phone: '9876543211',
      department: departments[0]._id,
      designation: 'ASSOCIATE_PROFESSOR',
      qualification: 'PHD',
      specialization: 'Database Management, SQL',
      experience: 10,
      joiningDate: new Date('2015-08-01'),
    });

    console.log('✅ Created 2 faculty members');

    // 6. Create Student Users and Profiles
    console.log('👨‍🎓 Creating students...');
    const students = [];
    
    for (let i = 1; i <= 5; i++) {
      const studentUser = await User.create({
        email: `student${i}@haridwar.edu`,
        firstName: `Student${i}`,
        lastName: `Test`,
        password: 'Student@123',
        role: 'STUDENT',
        emailVerified: true,
        isActive: true,
      });

      const student = await Student.create({
        user: studentUser._id,
        enrollmentNumber: `HU2024${String(i).padStart(3, '0')}`,
        firstName: `Student${i}`,
        lastName: `Test`,
        dateOfBirth: new Date('2005-01-15'),
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        phone: `987654${String(i).padStart(4, '0')}`,
        guardianName: `Guardian${i}`,
        guardianPhone: `987654${String(i + 100).padStart(4, '0')}`,
        guardianRelation: 'FATHER',
        department: departments[0]._id,
        course: courses[0]._id,
        currentSemester: 5,
        admissionDate: new Date('2024-08-01'),
        batch: '2024-2028',
        section: 'A',
        status: 'ACTIVE',
      });

      students.push(student);
    }
    console.log(`✅ Created ${students.length} students`);

    // 7. Create Exams
    console.log('📝 Creating exams...');
    const exams = await Exam.insertMany([
      {
        name: 'Mid Term Exam - Data Structures',
        type: 'MID_TERM',
        subject: subjects[0]._id,
        course: courses[0]._id,
        semester: 3,
        academicYear: '2024-2025',
        date: new Date('2024-10-15'),
        startTime: '10:00',
        endTime: '13:00',
        duration: 180,
        totalMarks: 100,
        passingMarks: 40,
        room: 'Room 101',
        isPublished: true,
        createdBy: faculty1._id,
      },
      {
        name: 'End Term Exam - Database Management',
        type: 'END_TERM',
        subject: subjects[1]._id,
        course: courses[0]._id,
        semester: 5,
        academicYear: '2024-2025',
        date: new Date('2024-12-20'),
        startTime: '10:00',
        endTime: '13:00',
        duration: 180,
        totalMarks: 100,
        passingMarks: 40,
        room: 'Room 102',
        isPublished: true,
        createdBy: faculty2._id,
      },
    ]);
    console.log(`✅ Created ${exams.length} exams`);

    // 8. Create Results
    console.log('📊 Creating results...');
    const results = [];
    for (const student of students) {
      // Result for first exam
      const result1 = await Result.create({
        student: student._id,
        exam: exams[0]._id,
        subject: subjects[0]._id,
        marksObtained: 70 + Math.floor(Math.random() * 25),
        totalMarks: 100,
        semester: 3,
        academicYear: '2024-2025',
        isPublished: true,
        publishedAt: new Date(),
        enteredBy: faculty1._id,
      });
      results.push(result1);

      // Result for second exam
      const result2 = await Result.create({
        student: student._id,
        exam: exams[1]._id,
        subject: subjects[1]._id,
        marksObtained: 65 + Math.floor(Math.random() * 30),
        totalMarks: 100,
        semester: 5,
        academicYear: '2024-2025',
        isPublished: true,
        publishedAt: new Date(),
        enteredBy: faculty2._id,
      });
      results.push(result2);
    }
    console.log(`✅ Created ${results.length} results`);

    // 9. Create Attendance Records
    console.log('📅 Creating attendance records...');
    const attendanceRecords = [];
    const today = new Date();
    
    for (let day = 0; day < 30; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      for (const student of students) {
        const status = Math.random() > 0.2 ? 'PRESENT' : 'ABSENT';
        
        const attendance = await Attendance.create({
          student: student._id,
          subject: subjects[1]._id,
          faculty: faculty2._id,
          date: date,
          status: status,
          session: 'MORNING',
          semester: 5,
          academicYear: '2024-2025',
        });
        attendanceRecords.push(attendance);
      }
    }
    console.log(`✅ Created ${attendanceRecords.length} attendance records`);

    // 10. Create Fee Structure
    console.log('💰 Creating fee structure...');
    const fees = await Fee.insertMany([
      {
        course: courses[0]._id,
        semester: 5,
        academicYear: '2024-2025',
        tuitionFee: 50000,
        examFee: 2000,
        libraryFee: 1000,
        labFee: 3000,
        otherFees: 2000,
        totalAmount: 58000,
        dueDate: new Date('2024-08-31'),
      },
    ]);
    console.log(`✅ Created ${fees.length} fee structures`);

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Admin: admin@haridwar.edu / Admin@123`);
    console.log(`   - Faculty: faculty1@haridwar.edu / Faculty@123`);
    console.log(`   - Faculty: faculty2@haridwar.edu / Faculty@123`);
    console.log(`   - Students: student1@haridwar.edu to student5@haridwar.edu / Student@123`);
    console.log(`   - Departments: ${departments.length}`);
    console.log(`   - Courses: ${courses.length}`);
    console.log(`   - Subjects: ${subjects.length}`);
    console.log(`   - Exams: ${exams.length}`);
    console.log(`   - Results: ${results.length}`);
    console.log(`   - Attendance: ${attendanceRecords.length}`);
    console.log(`   - Fees: ${fees.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
