"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServerConfig_1 = require("../config/ServerConfig");
const globalErrorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode;
    return res.status(statusCode).json({
        message: error,
        errorStack: ServerConfig_1.config.ENVIRONMENT === "development" ? error.stack : "",
    });
};
exports.default = globalErrorHandler;
