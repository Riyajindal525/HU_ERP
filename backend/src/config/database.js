import mongoose from 'mongoose';
import env from './env.js';
import logger from '../utils/logger.js';

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      const options = {
        maxPoolSize: 100,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        family: 4,
      };

      this.connection = await mongoose.connect(env.MONGODB_URI, options);

      logger.info('✅ MongoDB connected successfully');
      logger.info(`📊 Database: ${this.connection.connection.name}`);

      // Handle connection events
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      return this.connection;
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
    }
  }

  isConnected() {
    return mongoose.connection.readyState === 1;
  }
}

export default new Database();
