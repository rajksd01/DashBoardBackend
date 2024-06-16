"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const ServerConfig_1 = require("../config/ServerConfig");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const authenticate = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return next((0, http_errors_1.default)(401, "You are not allowed to perform this action"));
        }
        const parsedToken = token.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(parsedToken, ServerConfig_1.config.JWTSECRET);
        if (typeof decoded !== "string" && "id" in decoded) {
            const _req = req;
            _req.userId = decoded.id;
            next();
        }
        else {
            throw new Error("Invalid token format");
        }
    }
    catch (error) {
        console.log(error);
        return next((0, http_errors_1.default)(401, "Token Expired, Resignin and Continue"));
    }
};
exports.authenticate = authenticate;
