import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../src/models/Department.js';

dotenv.config();

const departments = [
  {
    name: 'Computer Science',
    code: 'CSE',
    description: 'Department of Computer Science and Engineering',
    hodName: 'Dr. Rajesh Kumar',
    totalSeats: 120,
    isActive: true
  },
  {
    name: 'Electronics and Communication',
    code: 'ECE',
    description: 'Department of Electronics and Communication Engineering',
    hodName: 'Dr. Priya Sharma',
    totalSeats: 100,
    isActive: true
  },
  {
    name: 'Mechanical Engineering',
    code: 'MECH',
    description: 'Department of Mechanical Engineering',
    hodName: 'Dr. Amit Patel',
    totalSeats: 90,
    isActive: true
  },
  {
    name: 'Civil Engineering',
    code: 'CIVIL',
    description: 'Department of Civil Engineering',
    hodName: 'Dr. Sunita Verma',
    totalSeats: 80,
    isActive: true
  },
  {
    name: 'Electrical Engineering',
    code: 'EEE',
    description: 'Department of Electrical and Electronics Engineering',
    hodName: 'Dr. Vikram Singh',
    totalSeats: 85,
    isActive: true
  }
];

async function seedDepartments() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing departments...');
    await Department.deleteMany({});
    console.log('✅ Cleared existing departments');

    console.log('🌱 Seeding departments...');
    const createdDepartments = await Department.insertMany(departments);
    console.log(`✅ Created ${createdDepartments.length} departments`);

    console.log('\n📋 Created Departments:');
    createdDepartments.forEach(dept => {
      console.log(`  - ${dept.name} (${dept.code})`);
    });

    console.log('\n✅ Department seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
    process.exit(1);
  }
}

seedDepartments();
