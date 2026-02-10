import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/haridwar_erp';

console.log('Attempting to connect to:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
