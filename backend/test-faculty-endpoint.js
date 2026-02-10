import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faculty from './src/models/Faculty.js';
import User from './src/models/User.js';
import Subject from './src/models/Subject.js';
import Department from './src/models/Department.js';

dotenv.config();

const testEndpoint = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Simulate what the /faculty/me endpoint does
        const userEmail = 'rahulramtekehu@gmail.com';
        
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('👤 User ID:', user._id);
        console.log('👤 User Role:', user.role);

        // This is what the getMe controller does
        const faculty = await Faculty.findOne({ user: user._id })
            .populate('department', 'name code')
            .populate({
                path: 'allocatedSubjects.subject',
                select: 'name code semester credits type'
            })
            .lean();

        if (!faculty) {
            console.log('❌ Faculty profile not found');
            process.exit(1);
        }

        console.log('\n✅ Faculty found!');
        console.log('Faculty ID:', faculty._id);
        console.log('Name:', faculty.firstName, faculty.lastName);
        console.log('\nAllocated Subjects Array:');
        console.log(JSON.stringify(faculty.allocatedSubjects, null, 2));

        // Calculate stats like the controller does
        const teachingHours = faculty.allocatedSubjects?.length * 4 || 0;
        const totalClasses = faculty.allocatedSubjects?.length * 3 || 0;

        const responseData = {
            success: true,
            data: {
                ...faculty,
                stats: {
                    totalClasses,
                    teachingHours,
                    pendingTasks: 5,
                }
            }
        };

        console.log('\n📤 Response that would be sent:');
        console.log(JSON.stringify(responseData, null, 2));

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testEndpoint();
