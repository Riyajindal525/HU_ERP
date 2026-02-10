import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const listIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    console.log('📋 Faculty Indexes:');
    const facultyIndexes = await db.collection('faculties').indexes();
    facultyIndexes.forEach(idx => {
      console.log(`   - ${idx.name}:`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '', idx.sparse ? '(sparse)' : '');
    });

    console.log('\n📋 Student Indexes:');
    const studentIndexes = await db.collection('students').indexes();
    studentIndexes.forEach(idx => {
      console.log(`   - ${idx.name}:`, JSON.stringify(idx.key), idx.unique ? '(unique)' : '', idx.sparse ? '(sparse)' : '');
    });

    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

listIndexes();
