import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import encryptionUtil from './src/utils/encryption.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const testOtpLogin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = 'rramteke2003@gmail.com';

    console.log('🧪 TESTING OTP LOGIN FLOW');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Step 1: Find user
    console.log(`1️⃣  Finding user: ${testEmail}`);
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    console.log(`✅ User found: ${user._id}\n`);

    // Step 2: Generate OTP
    console.log('2️⃣  Generating OTP...');
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`✅ Generated OTP: ${otp}\n`);

    // Step 3: Save OTP to user
    console.log('3️⃣  Saving OTP to database...');
    user.loginOtp = encryptionUtil.hashData(otp);
    user.loginOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });
    console.log('✅ OTP saved to database\n');

    // Step 4: Verify OTP
    console.log('4️⃣  Verifying OTP...');
    const userWithOtp = await User.findOne({ email: testEmail }).select('+loginOtp +loginOtpExpires');
    
    if (!userWithOtp.loginOtp || !userWithOtp.loginOtpExpires) {
      console.log('❌ OTP not found in database!');
      return;
    }

    const isOtpValid = encryptionUtil.compareData(otp, userWithOtp.loginOtp);
    const isExpired = Date.now() > userWithOtp.loginOtpExpires;

    console.log(`   OTP Valid: ${isOtpValid ? '✅' : '❌'}`);
    console.log(`   OTP Expired: ${isExpired ? '❌' : '✅'}`);

    if (isOtpValid && !isExpired) {
      console.log('\n🎉 OTP LOGIN FLOW WORKS CORRECTLY!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 TO LOGIN:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`1. Go to login page`);
      console.log(`2. Enter email: ${testEmail}`);
      console.log(`3. Click "Send OTP"`);
      console.log(`4. Check backend terminal for OTP`);
      console.log(`5. Enter OTP: ${otp}`);
      console.log(`6. Click "Verify & Login"`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } else {
      console.log('\n❌ OTP VERIFICATION FAILED!\n');
    }

    // Clean up - clear OTP
    user.loginOtp = undefined;
    user.loginOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log('🧹 Test OTP cleared from database');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit();
  }
};

testOtpLogin();
