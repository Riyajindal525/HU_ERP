import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';

dotenv.config();

const simpleSeed = async () => {
  try {
    console.log('🌱 Starting simple database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create Admin User
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      email: 'admin@haridwar.edu',
      firstName: 'Admin',
      lastName: 'User',
      password: 'Admin@123',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    });
    console.log('✅ Admin created:', admin.email);

    // Create Faculty User
    console.log('👨‍🏫 Creating faculty user...');
    const faculty = await User.create({
      email: 'faculty@haridwar.edu',
      firstName: 'Faculty',
      lastName: 'User',
      password: 'Faculty@123',
      role: 'FACULTY',
      emailVerified: true,
      isActive: true,
    });
    console.log('✅ Faculty created:', faculty.email);

    // Create Student User
    console.log('👨‍🎓 Creating student user...');
    const student = await User.create({
      email: 'student@haridwar.edu',
      firstName: 'Student',
      lastName: 'User',
      password: 'Student@123',
      role: 'STUDENT',
      emailVerified: true,
      isActive: true,
    });
    console.log('✅ Student created:', student.email);

    console.log('\n🎉 Simple seeding completed successfully!\n');
    console.log('📋 Login Credentials:');
    console.log('   - Admin: admin@haridwar.edu / Admin@123');
    console.log('   - Faculty: faculty@haridwar.edu / Faculty@123');
    console.log('   - Student: student@haridwar.edu / Student@123');
    console.log('\n⚠️  Note: Only user accounts created. No courses, subjects, etc.');
    console.log('   You can add them manually through the admin panel.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

simpleSeed();
