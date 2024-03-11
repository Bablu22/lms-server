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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_config_1 = __importDefault(require("./app/config/env.config"));
// create server
const port = env_config_1.default.PORT || 9000;
let server;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(env_config_1.default.MONGO_URI);
            server = app_1.default.listen(port, () => {
                console.log(`Server running on port ${port} in ${env_config_1.default.NODE_ENV} mode 🚀`);
            });
        }
        catch (error) {
            console.log('Error starting server: ', error);
        }
    });
}
main();
process.on('unhandledRejection', () => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`);
    process.exit(1);
});
