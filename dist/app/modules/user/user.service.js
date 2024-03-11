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
exports.userService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("./user.model"));
const user_utils_1 = require("./user.utils");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const sendEmail_1 = require("../../utils/sendEmail");
const console_1 = require("console");
const saveImageToCloudinart_1 = require("../../utils/saveImageToCloudinart");
const userVarification = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const isUserExist = yield user_model_1.default.isUserExist(email);
        if (isUserExist) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
        }
        // send validation email along with the code
        const varificationCode = (0, user_utils_1.createVarificationToken)({ name, email, password });
        const emailData = {
            name: name,
            email: email,
            code: varificationCode.code,
        };
        const html = yield ejs_1.default.renderFile(path_1.default.join(__dirname, '../../emails/varification.mail.ejs'), emailData);
        yield (0, sendEmail_1.sendEmail)(email, 'Account Verification', html);
        return {
            token: varificationCode.token,
        };
    }
    catch (error) {
        (0, console_1.log)(error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const userRegistration = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, code } = req.body;
        // verify token
        const decodedToken = (0, user_utils_1.verifyVarificationToken)(token);
        if (decodedToken.code !== code) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Please enter a valid code');
        }
        const { name, email, password } = decodedToken.user;
        const isUserExist = yield user_model_1.default.isUserExist(email);
        if (isUserExist) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
        }
        const user = yield user_model_1.default.create({ name, email, password, isVerified: true });
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const userLogin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isUserExist = yield user_model_1.default.isUserExist(email);
        if (!isUserExist) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid email or password');
        }
        const user = yield user_model_1.default.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid email or password');
        }
        const passwordMatch = yield user_model_1.default.comparePassword(password, user.password);
        if (!passwordMatch) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid email or password');
        }
        // create token
        const accessToken = user_model_1.default.createAccessToken(user._id);
        const refreshToken = user_model_1.default.createRefreshToken(user._id);
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const getUserById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const socialAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, avatar } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            const newUser = yield user_model_1.default.create({ email, name, avatar });
            return newUser;
        }
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const updatePassword = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = yield user_model_1.default.findById(req.user._id).select('+password');
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        const passwordMatch = yield user_model_1.default.comparePassword(oldPassword, user.password);
        if (!passwordMatch) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid password');
        }
        if (oldPassword === newPassword) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'New password cant be same as old password');
        }
        user.password = newPassword;
        yield user.save();
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
const updateProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const avatar = req.file;
        const user = yield user_model_1.default.findById(req.user._id);
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        if (name) {
            user.name = name;
        }
        if (avatar) {
            //delete old image from cloudinary
            if (user.avatar) {
                yield (0, saveImageToCloudinart_1.deleteImageFromCloudinary)(user.avatar.public_id);
            }
            const imageName = `profile-${user._id}-${Date.now()}`;
            const path = avatar.path;
            //send image to cloudinary
            const { secure_url, public_id } = (yield (0, saveImageToCloudinart_1.sendImageToCloudinary)(imageName, path));
            user.avatar = {
                url: secure_url,
                public_id,
            };
        }
        yield user.save();
        return user;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error);
    }
});
exports.userService = {
    userVarification,
    userRegistration,
    userLogin,
    getUserById,
    socialAuth,
    updatePassword,
    updateProfile,
};
