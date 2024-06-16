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
exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ServerConfig_1 = require("../config/ServerConfig");
// registering a user
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        const error = (0, http_errors_1.default)(400, "All fields are required");
        next(error);
    }
    try {
        const emailExist = yield user_model_1.default.findOne({ email: email });
        if (emailExist != null) {
            const error = (0, http_errors_1.default)(401, "User Already Exists, Please try to login instead");
            return next(error);
        }
    }
    catch (error) {
        return next(error);
    }
    const encryptedPassword = yield bcrypt_1.default.hash(password, ServerConfig_1.config.SALTROUNDS);
    const savedUser = yield user_model_1.default.create({
        name,
        email,
        password: encryptedPassword,
    });
    const { id } = savedUser;
    // generating token
    const token = jsonwebtoken_1.default.sign({ id, name, email }, ServerConfig_1.config.JWTSECRET);
    return res.status(200).json({
        userId: savedUser._id,
        token,
    });
});
exports.registerUser = registerUser;
// signing a user
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user;
    try {
        user = yield user_model_1.default.findOne({
            email: email,
        });
        console.log("user find done", user);
        if (user == null) {
            const error = (0, http_errors_1.default)(404, "Email Doesnot Exist");
            return next(error);
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        console.log("match  done", match);
        if (!match) {
            const error = (0, http_errors_1.default)(400, "Password Invalid");
            return res.status(400).json({
                message: error,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email }, ServerConfig_1.config.JWTSECRET);
        return res.json({
            userId: user._id,
            token,
        });
    }
    catch (error) {
        return error;
    }
});
exports.loginUser = loginUser;
