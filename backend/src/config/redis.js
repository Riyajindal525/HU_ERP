import { createClient } from 'redis';
import env from './env.js';
import logger from '../utils/logger.js';

class RedisClient {
  constructor() {
    this.client = null;
    this.isReady = false;
  }

  async connect() {
    try {
      this.client = createClient({
        url: env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 2) {
              logger.warn('Redis: Max reconnection attempts reached, disabling Redis');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 1000);
          },
        },
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isReady = false;
      });

      this.client.on('connect', () => {
        logger.info('🔄 Redis connecting...');
      });

      this.client.on('ready', () => {
        logger.info('✅ Redis connected and ready');
        this.isReady = true;
      });

      this.client.on('reconnecting', () => {
        logger.warn('⚠️  Redis reconnecting...');
        this.isReady = false;
      });

      this.client.on('end', () => {
        logger.info('Redis connection closed');
        this.isReady = false;
      });

      await this.client.connect();
      return this.client;
    } catch (error) {
      logger.error('❌ Redis connection failed:', error);
      // Don't exit - Redis is optional for basic functionality
      return null;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis disconnected');
    }
  }

  async get(key) {
    if (!this.isReady) return null;
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  }

  async set(key, value, expirationInSeconds = null) {
    if (!this.isReady) return false;
    try {
      if (expirationInSeconds) {
        await this.client.setEx(key, expirationInSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
      return false;
    }
  }

  async del(key) {
    if (!this.isReady) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
      return false;
    }
  }

  async exists(key) {
    if (!this.isReady) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  }

  async flushPattern(pattern) {
    if (!this.isReady) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
      return true;
    } catch (error) {
      logger.error(`Redis FLUSH error for pattern ${pattern}:`, error);
      return false;
    }
  }
}

export default new RedisClient();
