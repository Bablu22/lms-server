"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = exports.USER_ROLE = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const env_config_1 = __importDefault(require("../config/env.config"));
const redis_config_1 = require("../config/redis.config");
exports.auth = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this route',
        });
    }
    // verify token
    const decodedToken = jsonwebtoken_1.default.verify(accessToken, env_config_1.default.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: 'Invalid access token',
        });
    }
    const user = yield redis_config_1.redis.get(decodedToken.id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found',
        });
    }
    req.user = JSON.parse(user);
    next();
}));
exports.USER_ROLE = {
    admin: 'admin',
    user: 'user',
};
const role = (...roles) => {
    return (req, res, next) => {
        console.log(roles);
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        next();
    };
};
exports.role = role;
