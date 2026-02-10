import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from './src/models/Subject.js';
import Faculty from './src/models/Faculty.js';

dotenv.config();

const fixFacultySemester = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get all faculties with allocated subjects
        const faculties = await Faculty.find({ 'allocatedSubjects.0': { $exists: true } });

        console.log(`👨‍🏫 Found ${faculties.length} faculties with allocated subjects\n`);

        let updatedCount = 0;

        for (const faculty of faculties) {
            console.log(`\n📝 Processing: ${faculty.firstName} ${faculty.lastName}`);
            let facultyUpdated = false;

            for (let i = 0; i < faculty.allocatedSubjects.length; i++) {
                const allocation = faculty.allocatedSubjects[i];
                
                // Get the actual subject from database
                const subject = await Subject.findById(allocation.subject);
                
                if (!subject) {
                    console.log(`   ⚠️  Subject not found: ${allocation.subject}`);
                    continue;
                }

                // Check if semester matches
                if (allocation.semester !== subject.semester) {
                    console.log(`   🔄 Updating subject "${subject.name}": Semester ${allocation.semester} → ${subject.semester}`);
                    faculty.allocatedSubjects[i].semester = subject.semester;
                    facultyUpdated = true;
                } else {
                    console.log(`   ✅ Subject "${subject.name}": Semester ${subject.semester} (already correct)`);
                }
            }

            if (facultyUpdated) {
                await faculty.save();
                updatedCount++;
                console.log(`   💾 Saved changes for ${faculty.firstName} ${faculty.lastName}`);
            }
        }

        console.log(`\n✅ Update completed!`);
        console.log(`   Updated: ${updatedCount} faculties`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixFacultySemester();
