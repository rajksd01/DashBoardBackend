"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const _config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.MONGO_URI,
    ENVIRONMENT: process.env.NODE_ENV,
    SALTROUNDS: Number(process.env.SALT_ROUNDS),
    JWTSECRET: process.env.JWT_SECRET,
    CLOUDINARYCLOUD: process.env.CLOUDINARY_CLOUD,
    CLOUDINARYAPIKEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARYSECRET: process.env.CLOUDINARY_API_SECRET,
};
exports.config = Object.freeze(_config);
