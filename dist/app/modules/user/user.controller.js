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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const redis_config_1 = require("../../config/redis.config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const user_model_1 = __importDefault(require("./user.model"));
const sendVarificationToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.userVarification(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Please check your email to verify your account.',
        data: result,
    });
}));
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.userRegistration(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User registered successfully',
        data: result,
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.userLogin(req);
    const { user, accessToken, refreshToken } = result;
    // save to redis
    yield redis_config_1.redis.set(user._id.toString(), JSON.stringify(user), 'EX', 7 * 24 * 60 * 60);
    res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
    });
    res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'lax',
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User logged in successfully',
        data: result,
    });
}));
const logoutUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    // delete from redis
    yield redis_config_1.redis.del(userId.toString());
    res.cookie('refreshToken', '', { maxAge: 1 });
    res.cookie('accessToken', '', { maxAge: 1 });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User logged out successfully',
        data: {},
    });
}));
const updateAccessAndRefreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this route',
        });
    }
    // verify token
    const decodedToken = jsonwebtoken_1.default.verify(refreshToken, env_config_1.default.REFRESH_TOKEN_SECRET);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token',
        });
    }
    const user = yield redis_config_1.redis.get(decodedToken.id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'User not found',
        });
    }
    const accessToken = user_model_1.default.createAccessToken(decodedToken.id);
    const newRefreshToken = user_model_1.default.createRefreshToken(decodedToken.id);
    res.cookie('refreshToken', newRefreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
    });
    res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'lax',
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Token refreshed successfully',
        data: {
            accessToken,
            refreshToken: newRefreshToken,
        },
    });
}));
const getMe = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User details',
        data: user,
    });
}));
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getUserById(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User details',
        data: user,
    });
}));
const socialAuth = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.socialAuth(req);
    const accessToken = user_model_1.default.createAccessToken(user._id);
    const refreshToken = user_model_1.default.createRefreshToken(user._id);
    // save to redis
    yield redis_config_1.redis.set(user._id.toString(), JSON.stringify(user), 'EX', 7 * 24 * 60 * 60);
    res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
    });
    res.cookie('accessToken', accessToken, {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: 'lax',
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User logged in successfully',
        data: user,
    });
}));
const updatePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.updatePassword(req);
    yield redis_config_1.redis.set(result._id.toString(), JSON.stringify(result), 'EX', 7 * 24 * 60 * 60);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Password updated successfully',
        data: result,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.updateProfile(req);
    yield redis_config_1.redis.set(result._id.toString(), JSON.stringify(result), 'EX', 7 * 24 * 60 * 60);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
exports.userController = {
    registerUser,
    loginUser,
    sendVarificationToken,
    logoutUser,
    updateAccessAndRefreshToken,
    getMe,
    getUserById,
    socialAuth,
    updatePassword,
    updateProfile,
};
