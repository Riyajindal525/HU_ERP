import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subject from '../src/models/Subject.js';
import Faculty from '../src/models/Faculty.js';

dotenv.config();

const syncFacultySubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all subjects with faculty assignments
        const subjects = await Subject.find({ 
            'facultyAssigned.0': { $exists: true } 
        });

        console.log(`\n📚 Found ${subjects.length} subjects with faculty assignments`);

        let syncedCount = 0;
        let errorCount = 0;

        for (const subject of subjects) {
            console.log(`\n📖 Processing: ${subject.name} (${subject.code})`);

            for (const assignment of subject.facultyAssigned) {
                try {
                    // Skip if faculty ID is null or invalid
                    if (!assignment.faculty) {
                        console.log(`   ⚠️  Skipping null faculty assignment`);
                        continue;
                    }

                    const faculty = await Faculty.findById(assignment.faculty);
                    
                    if (!faculty) {
                        console.log(`   ⚠️  Faculty not found: ${assignment.faculty}`);
                        errorCount++;
                        continue;
                    }

                    // Check if already exists in faculty's allocatedSubjects
                    const exists = faculty.allocatedSubjects.some(
                        sub => sub.subject.toString() === subject._id.toString() && 
                               sub.section === assignment.section
                    );

                    if (!exists) {
                        faculty.allocatedSubjects.push({
                            subject: subject._id,
                            semester: subject.semester,
                            academicYear: assignment.academicYear,
                            section: assignment.section
                        });

                        await faculty.save();
                        console.log(`   ✅ Synced to ${faculty.firstName} ${faculty.lastName} (Section: ${assignment.section || 'N/A'})`);
                        syncedCount++;
                    } else {
                        console.log(`   ℹ️  Already synced for ${faculty.firstName} ${faculty.lastName}`);
                    }
                } catch (error) {
                    console.log(`   ❌ Error: ${error.message}`);
                    errorCount++;
                }
            }
        }

        console.log(`\n✅ Sync completed!`);
        console.log(`   Synced: ${syncedCount}`);
        console.log(`   Errors: ${errorCount}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

syncFacultySubjects();
