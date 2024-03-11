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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const env_config_1 = __importDefault(require("../../config/env.config"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: {
            validator: function (v) {
                const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(v);
            },
            message: 'Please enter a valid email',
        },
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 6,
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [
        {
            courseId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Course',
            },
        },
    ],
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = bcryptjs_1.default.hashSync(this.password, 10);
    next();
});
userSchema.statics.comparePassword = function (enteredPassword, userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(enteredPassword, userPassword);
    });
};
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        return user ? true : false;
    });
};
userSchema.statics.createAccessToken = function (id) {
    return jsonwebtoken_1.default.sign({ id }, env_config_1.default.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};
userSchema.statics.createRefreshToken = function (id) {
    return jsonwebtoken_1.default.sign({ id }, env_config_1.default.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
