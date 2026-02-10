import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './src/models/Student.js';
import Subject from './src/models/Subject.js';
import Faculty from './src/models/Faculty.js';
import Department from './src/models/Department.js';
import Course from './src/models/Course.js';

dotenv.config();

const checkStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all students
        const allStudents = await Student.find({})
            .select('firstName lastName enrollmentNumber currentSemester section department course')
            .populate('department', 'name')
            .populate('course', 'name')
            .lean();

        console.log(`📊 Total Students: ${allStudents.length}\n`);

        // Group by semester
        const bySemester = {};
        allStudents.forEach(student => {
            const sem = student.currentSemester || 'undefined';
            if (!bySemester[sem]) bySemester[sem] = [];
            bySemester[sem].push(student);
        });

        console.log('📚 Students by Semester:');
        Object.keys(bySemester).sort().forEach(sem => {
            console.log(`   Semester ${sem}: ${bySemester[sem].length} students`);
        });

        // Check semester 1 students specifically
        console.log('\n🔍 Semester 1 Students:');
        const sem1Students = allStudents.filter(s => s.currentSemester === 1);
        if (sem1Students.length === 0) {
            console.log('   ❌ No students found in Semester 1');
        } else {
            sem1Students.forEach(s => {
                console.log(`   - ${s.firstName} ${s.lastName} (${s.enrollmentNumber}) - Section: ${s.section || 'N/A'}`);
            });
        }

        // Check semester 6 students
        console.log('\n🔍 Semester 6 Students:');
        const sem6Students = allStudents.filter(s => s.currentSemester === 6);
        if (sem6Students.length === 0) {
            console.log('   ❌ No students found in Semester 6');
        } else {
            sem6Students.forEach(s => {
                console.log(`   - ${s.firstName} ${s.lastName} (${s.enrollmentNumber}) - Section: ${s.section || 'N/A'}`);
            });
        }

        // Check subjects
        console.log('\n📖 Checking Subjects:');
        const subjects = await Subject.find({ 'facultyAssigned.0': { $exists: true } })
            .populate('facultyAssigned.faculty', 'firstName lastName')
            .lean();

        subjects.forEach(subject => {
            console.log(`\n   Subject: ${subject.name} (${subject.code})`);
            console.log(`   Semester: ${subject.semester}`);
            subject.facultyAssigned.forEach(fa => {
                console.log(`   - Faculty: ${fa.faculty?.firstName} ${fa.faculty?.lastName}, Section: ${fa.section || 'N/A'}`);
            });
        });

        // Check faculty allocations
        console.log('\n👨‍🏫 Checking Faculty Allocations:');
        const faculties = await Faculty.find({ 'allocatedSubjects.0': { $exists: true } })
            .populate('allocatedSubjects.subject', 'name code semester')
            .lean();

        faculties.forEach(faculty => {
            console.log(`\n   Faculty: ${faculty.firstName} ${faculty.lastName}`);
            faculty.allocatedSubjects.forEach(alloc => {
                console.log(`   - Subject: ${alloc.subject?.name}, Semester: ${alloc.semester}, Section: ${alloc.section || 'N/A'}`);
            });
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkStudents();
