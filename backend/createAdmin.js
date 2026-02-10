import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hu-erp');
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@test.com';
    const adminPassword = 'password123';

    // Check if admin exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists');
      if (admin.role !== 'SUPER_ADMIN') {
          admin.role = 'SUPER_ADMIN';
          await admin.save();
          console.log('Updated role to SUPER_ADMIN');
      }
    } else {
      admin = await User.create({
        email: adminEmail,
        password: adminPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true
      });
      console.log('Admin user created successfully');
    }

    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

createAdmin();
