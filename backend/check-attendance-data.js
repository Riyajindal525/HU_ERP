import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './src/models/Attendance.js';
import Student from './src/models/Student.js';
import Subject from './src/models/Subject.js';

dotenv.config();

const checkAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all attendance records
        const allAttendance = await Attendance.find({})
            .populate('student', 'firstName lastName enrollmentNumber')
            .populate('subject', 'name code')
            .populate('faculty', 'firstName lastName')
            .lean();

        console.log(`📊 Total Attendance Records: ${allAttendance.length}\n`);

        if (allAttendance.length === 0) {
            console.log('❌ No attendance records found in database!');
            console.log('   Faculty needs to mark attendance first.\n');
        } else {
            console.log('📝 Attendance Records:');
            allAttendance.forEach((record, index) => {
                console.log(`\n${index + 1}. Student: ${record.student?.firstName} ${record.student?.lastName}`);
                console.log(`   Subject: ${record.subject?.name}`);
                console.log(`   Faculty: ${record.faculty?.firstName} ${record.faculty?.lastName}`);
                console.log(`   Date: ${new Date(record.date).toLocaleDateString()}`);
                console.log(`   Status: ${record.status}`);
                console.log(`   Session: ${record.session}`);
                console.log(`   Semester: ${record.semester}`);
            });
        }

        // Check for math subject specifically
        console.log('\n\n🔍 Checking for "math" subject attendance:');
        const mathSubject = await Subject.findOne({ name: /math/i });
        if (mathSubject) {
            console.log(`   Found subject: ${mathSubject.name} (ID: ${mathSubject._id})`);
            
            const mathAttendance = await Attendance.find({ subject: mathSubject._id })
                .populate('student', 'firstName lastName')
                .lean();
            
            console.log(`   Attendance records for math: ${mathAttendance.length}`);
            mathAttendance.forEach(record => {
                console.log(`   - ${record.student?.firstName} ${record.student?.lastName}: ${record.status} on ${new Date(record.date).toLocaleDateString()}`);
            });
        } else {
            console.log('   ❌ Math subject not found');
        }

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAttendance();
