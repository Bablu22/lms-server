"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyVarificationToken = exports.createVarificationToken = void 0;
const env_config_1 = __importDefault(require("../../config/env.config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createVarificationToken = (user) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    // create token
    const token = jsonwebtoken_1.default.sign({ code, user }, env_config_1.default.ACTIVATION_SECRET, {
        expiresIn: '5m',
    });
    return {
        code,
        token,
    };
};
exports.createVarificationToken = createVarificationToken;
const verifyVarificationToken = (token) => {
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, env_config_1.default.ACTIVATION_SECRET);
        return decodedToken;
    }
    catch (error) {
        throw new Error('Invalid or expired token');
    }
};
exports.verifyVarificationToken = verifyVarificationToken;
