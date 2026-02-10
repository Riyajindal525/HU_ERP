import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createMyAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Your email address
    const adminEmail = 'rramteke2003@gmail.com';
    const firstName = 'Rahul';
    const lastName = 'Ramteke';

    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('⚠️  User already exists with this email');
      
      // Update to SUPER_ADMIN if not already
      if (admin.role !== 'SUPER_ADMIN') {
        admin.role = 'SUPER_ADMIN';
        admin.isActive = true;
        admin.emailVerified = true;
        admin.firstName = firstName;
        admin.lastName = lastName;
        await admin.save();
        console.log('✅ Updated existing user to SUPER_ADMIN');
      } else {
        console.log('✅ User is already a SUPER_ADMIN');
      }
    } else {
      // Create new admin user (OTP-based, no password needed)
      admin = await User.create({
        email: adminEmail,
        firstName: firstName,
        lastName: lastName,
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true,
        password: 'TempPassword123!' // Temporary, won't be used (OTP login)
      });
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📧 Admin Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email: ${adminEmail}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Role: ${admin.role}`);
    console.log(`Active: ${admin.isActive}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Login Instructions:');
    console.log('1. Go to login page');
    console.log(`2. Enter email: ${adminEmail}`);
    console.log('3. Click "Send OTP"');
    console.log('4. Check backend terminal for OTP');
    console.log('5. Enter OTP and login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit();
  }
};

createMyAdmin();
