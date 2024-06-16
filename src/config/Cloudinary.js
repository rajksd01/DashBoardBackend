"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const ServerConfig_1 = require("./ServerConfig");
cloudinary_1.v2.config({
    cloud_name: ServerConfig_1.config.CLOUDINARYCLOUD,
    api_key: ServerConfig_1.config.CLOUDINARYAPIKEY,
    api_secret: ServerConfig_1.config.CLOUDINARYSECRET,
});
exports.default = cloudinary_1.v2;
