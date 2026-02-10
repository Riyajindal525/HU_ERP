import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './src/models/Attendance.js';
import Student from './src/models/Student.js';
import Subject from './src/models/Subject.js';
import Faculty from './src/models/Faculty.js';

dotenv.config();

const testMarkAttendance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get a student
        const student = await Student.findOne({ section: 'b', currentSemester: 1 });
        if (!student) {
            console.log('❌ No student found in Semester 1, Section B');
            process.exit(1);
        }
        console.log(`📚 Student: ${student.firstName} ${student.lastName} (${student._id})`);

        // Get math subject
        const subject = await Subject.findOne({ name: /math/i });
        if (!subject) {
            console.log('❌ Math subject not found');
            process.exit(1);
        }
        console.log(`📖 Subject: ${subject.name} (${subject._id})`);

        // Get faculty
        const faculty = await Faculty.findOne({ 'allocatedSubjects.subject': subject._id });
        if (!faculty) {
            console.log('❌ No faculty assigned to math');
            process.exit(1);
        }
        console.log(`👨‍🏫 Faculty: ${faculty.firstName} ${faculty.lastName} (${faculty._id})\n`);

        // Create test attendance record
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('📝 Creating test attendance record...');
        
        const attendanceData = {
            student: student._id,
            subject: subject._id,
            faculty: faculty._id,
            date: today,
            status: 'PRESENT',
            session: 'MORNING',
            semester: student.currentSemester || 1,
            academicYear: `${today.getFullYear()}-${today.getFullYear() + 1}`,
        };

        console.log('Data to save:', JSON.stringify(attendanceData, null, 2));

        // Try to create
        try {
            const attendance = await Attendance.create(attendanceData);
            console.log('\n✅ Attendance record created successfully!');
            console.log('Record ID:', attendance._id);
        } catch (error) {
            if (error.code === 11000) {
                console.log('\n⚠️  Attendance already exists for this student/subject/date/session');
                console.log('   This is correct behavior - prevents duplicates!');
                
                // Try to update instead
                const updated = await Attendance.findOneAndUpdate(
                    {
                        student: student._id,
                        subject: subject._id,
                        date: today,
                        session: 'MORNING'
                    },
                    { status: 'PRESENT', faculty: faculty._id },
                    { new: true }
                );
                console.log('   Updated existing record:', updated._id);
            } else {
                throw error;
            }
        }

        // Verify it was saved
        const saved = await Attendance.findOne({
            student: student._id,
            subject: subject._id,
            date: today,
            session: 'MORNING'
        });

        if (saved) {
            console.log('\n✅ Verification: Record found in database');
            console.log('   Student:', saved.student);
            console.log('   Subject:', saved.subject);
            console.log('   Status:', saved.status);
            console.log('   Session:', saved.session);
            console.log('   Semester:', saved.semester);
            console.log('   Academic Year:', saved.academicYear);
        } else {
            console.log('\n❌ Verification failed: Record not found');
        }

        // Count total attendance records
        const total = await Attendance.countDocuments({});
        console.log(`\n📊 Total attendance records in database: ${total}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testMarkAttendance();
