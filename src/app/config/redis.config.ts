import { Redis } from 'ioredis'
import envConfig from './env.config'

const redisClient = () => {
  if (envConfig.REDIS_URL) {
    console.log('Redis connected successfully 🚀')
    return envConfig.REDIS_URL
  }
  throw new Error('Redis URL is not defined in .env file')
}

export const redis = new Redis(redisClient())
