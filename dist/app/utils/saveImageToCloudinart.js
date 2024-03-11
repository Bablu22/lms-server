"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.deleteImageFromCloudinary = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_config_1 = __importDefault(require("../config/env.config"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const AppError_1 = __importDefault(require("../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
cloudinary_1.v2.config({
    cloud_name: env_config_1.default.CLOUDINARY_CLOUD_NAME,
    api_key: env_config_1.default.CLOUDINARY_API_KEY,
    api_secret: env_config_1.default.CLOUDINARY_API_SECRET,
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, {
            public_id: imageName.trim(),
            folder: 'lms',
            width: 150,
            height: 150,
            crop: 'fill',
        }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            fs_1.default.unlink(path, err => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('File is deleted.');
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const deleteImageFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.destroy(publicId, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
        });
    });
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/');
    },
    filename: function (req, file, cb) {
        const types = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!types.includes(file.mimetype)) {
            return cb(new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Only jpeg, jpg and png files are allowed'), '');
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
