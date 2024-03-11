"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_config_1 = __importDefault(require("./app/config/env.config"));
const not_found_1 = __importDefault(require("./app/middleware/not-found"));
const error_handler_1 = __importDefault(require("./app/middleware/error-handler"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_config_1.default.ORIGIN,
    credentials: true,
}));
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to the API',
    });
});
// application routes
app.use('/api/v1', routes_1.default);
// Middleware
app.use(error_handler_1.default);
app.use(not_found_1.default);
exports.default = app;
