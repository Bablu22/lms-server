"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../error/AppError"));
const zod_1 = require("zod");
const env_config_1 = __importDefault(require("../config/env.config"));
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong!';
    let errorSource = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message.split(':')[1] || err.message;
        errorSource = [
            {
                path: '',
                message: err.message.split(':')[1] || err.message,
            },
        ];
    }
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = 'Invalid data provided!';
        errorSource = err.errors.map(error => {
            return {
                path: error.path.join('.'),
                message: error.message,
            };
        });
    }
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token!';
        errorSource = [
            {
                path: '',
                message: 'Invalid token!',
            },
        ];
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired!';
        errorSource = [
            {
                path: '',
                message: 'Token expired!',
            },
        ];
    }
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error!';
        errorSource = err.details.map((error) => {
            return {
                path: error.path.join('.'),
                message: error.message,
            };
        });
    }
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Duplicate field value entered';
        errorSource = [
            {
                path: '',
                message: 'Duplicate field value entered',
            },
        ];
    }
    if (err.message.includes('CastError')) {
        statusCode = 400;
        message = 'Invalid data provided!';
        errorSource = [
            {
                path: '',
                message: 'Invalid data provided!',
            },
        ];
    }
    if (err.name === 'SyntaxError') {
        statusCode = 400;
        message = 'Invalid JSON!';
        errorSource = [
            {
                path: '',
                message: 'Invalid JSON!',
            },
        ];
    }
    if (err.name === 'MulterError') {
        statusCode = 400;
        message = 'Invalid file type!';
        errorSource = [
            {
                path: '',
                message: 'Invalid file type!',
            },
        ];
    }
    if (env_config_1.default.NODE_ENV === 'development') {
        console.log(err);
    }
    return res.status(statusCode).json({
        success: false,
        message,
        errorSource,
        stack: env_config_1.default.NODE_ENV === 'development' ? err.stack : null,
    });
};
exports.default = errorHandler;
