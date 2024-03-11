"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.loginUserSchema = exports.registerUserSchema = exports.userVarificationSchema = void 0;
const zod_1 = require("zod");
exports.userVarificationSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
    email: zod_1.z
        .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
    })
        .email({
        message: 'Please enter a valid email address',
    }),
    password: zod_1.z
        .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    })
        .min(6, { message: 'Password must be at least 6 characters long' }),
});
exports.registerUserSchema = zod_1.z.object({
    token: zod_1.z.string({
        required_error: 'Please provide a token to verify your account',
        invalid_type_error: 'Token must be a string',
    }),
    code: zod_1.z.string({
        required_error: 'Please provide a code to verify your account',
        invalid_type_error: 'Code must be a string',
    }),
});
exports.loginUserSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: 'Please enter your email address',
        invalid_type_error: 'Email must be a string',
    })
        .email({
        message: 'Please enter a valid email address',
    }),
    password: zod_1.z
        .string({
        required_error: 'Please enter your password',
        invalid_type_error: 'Password must be a string',
    })
        .min(6, { message: 'Password must be at least 6 characters long' }),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string({
        required_error: 'Please enter your old password',
        invalid_type_error: 'Old password must be a string',
    }),
    newPassword: zod_1.z
        .string({
        required_error: 'Please enter your new password',
        invalid_type_error: 'New password must be a string',
    })
        .min(6, { message: 'Password must be at least 6 characters long' }),
});
