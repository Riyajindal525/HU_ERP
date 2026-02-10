import app from './src/app.js';
import env from './src/config/env.js';
import database from './src/config/database.js';
import redisClient from './src/config/redis.js';
import logger from './src/utils/logger.js';

let server;

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await database.connect();

    // Connect to Redis (optional - don't block server startup)
    redisClient.connect().catch((redisError) => {
      logger.warn('⚠️ Redis connection failed, running without caching');
      logger.warn('Redis Error:', redisError.message);
    });

    // Start Express server
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 API: http://localhost:${env.PORT}/api/v1`);
      logger.info(`❤️  Health Check: http://localhost:${env.PORT}/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (error) => {
      logger.error('UNHANDLED REJECTION! Shutting down...');
      logger.error(error);
      
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('SIGTERM RECEIVED. Shutting down gracefully...');
      
      server.close(async () => {
        logger.info('Process terminated!');
        await database.disconnect();
        redisClient.disconnect().catch(() => {}); // Don't wait for Redis
        process.exit(0);
      });
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', async () => {
      logger.info('SIGINT RECEIVED. Shutting down gracefully...');
      
      server.close(async () => {
        logger.info('Process terminated!');
        await database.disconnect();
        redisClient.disconnect().catch(() => {}); // Don't wait for Redis
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
