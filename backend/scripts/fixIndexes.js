import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const fixIndexes = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    console.log('🔧 Fixing Faculty indexes...');
    
    // Drop ALL employeeId indexes
    const facultyIndexes = await db.collection('faculties').indexes();
    for (const idx of facultyIndexes) {
      if (idx.name.includes('employeeId') && idx.name !== '_id_') {
        try {
          await db.collection('faculties').dropIndex(idx.name);
          console.log(`✅ Dropped ${idx.name}`);
        } catch (error) {
          console.log(`⚠️  Could not drop ${idx.name}`);
        }
      }
    }

    // Create ONE sparse unique index
    await db.collection('faculties').createIndex(
      { employeeId: 1 },
      { unique: true, sparse: true }
    );
    console.log('✅ Created new sparse unique index on employeeId');

    console.log('\n🔧 Fixing Student indexes...');
    
    // Drop ALL enrollmentNumber indexes
    const studentIndexes = await db.collection('students').indexes();
    for (const idx of studentIndexes) {
      if (idx.name.includes('enrollmentNumber') && idx.name !== '_id_') {
        try {
          await db.collection('students').dropIndex(idx.name);
          console.log(`✅ Dropped ${idx.name}`);
        } catch (error) {
          console.log(`⚠️  Could not drop ${idx.name}`);
        }
      }
    }

    // Create ONE sparse unique index
    await db.collection('students').createIndex(
      { enrollmentNumber: 1 },
      { unique: true, sparse: true }
    );
    console.log('✅ Created new sparse unique index on enrollmentNumber');

    console.log('\n🎉 All indexes fixed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

fixIndexes();
