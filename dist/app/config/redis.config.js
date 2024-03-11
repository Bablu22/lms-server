"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const env_config_1 = __importDefault(require("./env.config"));
const redisClient = () => {
    if (env_config_1.default.REDIS_URL) {
        console.log('Redis connected successfully 🚀');
        return env_config_1.default.REDIS_URL;
    }
    throw new Error('Redis URL is not defined in .env file');
};
exports.redis = new ioredis_1.Redis(redisClient());
