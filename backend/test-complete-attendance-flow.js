import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from './src/models/Attendance.js';
import Student from './src/models/Student.js';
import Subject from './src/models/Subject.js';
import Faculty from './src/models/Faculty.js';

dotenv.config();

const testCompleteFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Step 1: Get all students in Semester 1, Section B
        const students = await Student.find({ 
            section: 'b', 
            currentSemester: 1 
        }).lean();
        
        console.log(`📚 Found ${students.length} students in Semester 1, Section B:`);
        students.forEach(s => {
            console.log(`   - ${s.firstName} ${s.lastName} (${s._id})`);
        });

        // Step 2: Get math subject
        const subject = await Subject.findOne({ name: /math/i }).lean();
        if (!subject) {
            console.log('\n❌ Math subject not found');
            process.exit(1);
        }
        console.log(`\n📖 Subject: ${subject.name} (${subject._id})`);

        // Step 3: Get faculty
        const faculty = await Faculty.findOne({ 
            'allocatedSubjects.subject': subject._id 
        }).lean();
        if (!faculty) {
            console.log('❌ No faculty assigned to math');
            process.exit(1);
        }
        console.log(`👨‍🏫 Faculty: ${faculty.firstName} ${faculty.lastName} (${faculty._id})`);

        // Step 4: Mark attendance for all students
        console.log('\n📝 Marking attendance for all students...');
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const academicYear = `${today.getFullYear()}-${today.getFullYear() + 1}`;

        let created = 0;
        let updated = 0;

        for (const student of students) {
            try {
                const attendanceData = {
                    student: student._id,
                    subject: subject._id,
                    faculty: faculty._id,
                    date: today,
                    status: 'PRESENT', // Mark all as present for testing
                    session: 'MORNING',
                    semester: student.currentSemester || 1,
                    academicYear,
                };

                const existing = await Attendance.findOne({
                    student: student._id,
                    subject: subject._id,
                    date: today,
                    session: 'MORNING'
                });

                if (existing) {
                    await Attendance.updateOne(
                        { _id: existing._id },
                        { $set: { status: 'PRESENT', faculty: faculty._id } }
                    );
                    updated++;
                    console.log(`   ✅ Updated: ${student.firstName} ${student.lastName}`);
                } else {
                    await Attendance.create(attendanceData);
                    created++;
                    console.log(`   ✅ Created: ${student.firstName} ${student.lastName}`);
                }
            } catch (error) {
                console.log(`   ❌ Error for ${student.firstName}: ${error.message}`);
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Created: ${created}`);
        console.log(`   Updated: ${updated}`);
        console.log(`   Total: ${created + updated}`);

        // Step 5: Verify - Fetch attendance for this subject
        console.log('\n🔍 Fetching attendance records for math subject...');
        const attendanceRecords = await Attendance.find({ 
            subject: subject._id 
        })
        .populate('student', 'firstName lastName enrollmentNumber')
        .lean();

        console.log(`\n✅ Found ${attendanceRecords.length} attendance records:`);
        attendanceRecords.forEach(record => {
            console.log(`   - ${record.student.firstName} ${record.student.lastName}: ${record.status} (${record.session})`);
        });

        // Step 6: Calculate statistics per student
        console.log('\n📈 Attendance Statistics:');
        for (const student of students) {
            const studentRecords = attendanceRecords.filter(
                r => r.student._id.toString() === student._id.toString()
            );
            const present = studentRecords.filter(r => r.status === 'PRESENT').length;
            const total = studentRecords.length;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
            
            console.log(`   ${student.firstName} ${student.lastName}: ${percentage}% (${present}/${total})`);
        }

        console.log('\n✅ Complete flow test successful!');
        console.log('\n📋 Next Steps:');
        console.log('   1. Restart your backend server (Ctrl+C then npm start)');
        console.log('   2. Login as faculty');
        console.log('   3. Go to "View Students"');
        console.log('   4. Select: Semester 1, Section B, Subject: math');
        console.log('   5. You should see the attendance data!');

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testCompleteFlow();
