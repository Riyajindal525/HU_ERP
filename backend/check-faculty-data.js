import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './src/models/Faculty.js';
import User from './src/models/User.js';
import Subject from './src/models/Subject.js';

dotenv.config();

const checkFacultyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find faculty by email
        const user = await User.findOne({ email: 'rahulramtekehu@gmail.com' });
        
        if (!user) {
            console.log('❌ User not found with email: rahulramtekehu@gmail.com');
            process.exit(1);
        }

        console.log('👤 User found:');
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}\n`);

        // Find faculty profile
        const faculty = await Faculty.findOne({ user: user._id })
            .populate('department', 'name code')
            .populate({
                path: 'allocatedSubjects.subject',
                select: 'name code semester credits type'
            });

        if (!faculty) {
            console.log('❌ Faculty profile not found for this user');
            process.exit(1);
        }

        console.log('👨‍🏫 Faculty Profile:');
        console.log(`   ID: ${faculty._id}`);
        console.log(`   Name: ${faculty.firstName} ${faculty.lastName}`);
        console.log(`   Employee ID: ${faculty.employeeId || 'N/A'}`);
        console.log(`   Department: ${faculty.department?.name || 'N/A'}`);
        console.log(`   Allocated Subjects Count: ${faculty.allocatedSubjects?.length || 0}\n`);

        if (faculty.allocatedSubjects && faculty.allocatedSubjects.length > 0) {
            console.log('📚 Allocated Subjects:');
            faculty.allocatedSubjects.forEach((allocation, idx) => {
                console.log(`\n${idx + 1}. Subject ID: ${allocation.subject?._id || allocation.subject}`);
                console.log(`   Name: ${allocation.subject?.name || 'Not populated'}`);
                console.log(`   Code: ${allocation.subject?.code || 'Not populated'}`);
                console.log(`   Semester: ${allocation.semester}`);
                console.log(`   Section: ${allocation.section || 'N/A'}`);
                console.log(`   Academic Year: ${allocation.academicYear || 'N/A'}`);
            });
        } else {
            console.log('❌ No subjects in allocatedSubjects array');
        }

        // Check subjects that have this faculty assigned
        console.log('\n\n🔍 Checking subjects with this faculty assigned...');
        const subjects = await Subject.find({
            'facultyAssigned.faculty': faculty._id
        }).select('name code semester facultyAssigned');

        console.log(`\nFound ${subjects.length} subjects with this faculty assigned:\n`);
        subjects.forEach((subject, idx) => {
            console.log(`${idx + 1}. ${subject.name} (${subject.code})`);
            console.log(`   Semester: ${subject.semester}`);
            const assignment = subject.facultyAssigned.find(
                fa => fa.faculty.toString() === faculty._id.toString()
            );
            if (assignment) {
                console.log(`   Section: ${assignment.section || 'N/A'}`);
                console.log(`   Academic Year: ${assignment.academicYear || 'N/A'}`);
            }
            console.log('');
        });

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkFacultyData();
