import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './src/models/Department.js';

dotenv.config();

async function verifyDepartments() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('📋 Fetching all departments from database...');
    const departments = await Department.find().sort({ name: 1 });
    
    console.log(`\n✅ Found ${departments.length} departments:\n`);
    
    if (departments.length === 0) {
      console.log('⚠️  No departments found in database!');
      console.log('💡 Run: npm run seed:dept to add sample departments\n');
    } else {
      departments.forEach((dept, index) => {
        console.log(`${index + 1}. ${dept.name} (${dept.code})`);
        console.log(`   HOD: ${dept.hodName || 'Not assigned'}`);
        console.log(`   Description: ${dept.description || 'N/A'}`);
        console.log(`   Active: ${dept.isActive}`);
        console.log(`   ID: ${dept._id}`);
        console.log('');
      });
    }

    console.log('✅ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyDepartments();
