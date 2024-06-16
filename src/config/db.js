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
const ServerConfig_1 = require("./ServerConfig");
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connection.on("error", (error) => {
            console.error("Database Connection Failed ", error);
        });
        mongoose_1.default.connection.on("connected", () => {
            console.log("Connected to Database  Successfully");
        });
        yield mongoose_1.default.connect(ServerConfig_1.config.DATABASE_URL);
    }
    catch (error) {
        console.log(`Error while connecting to database: ${error}`);
        process.exit(1);
    }
});
exports.default = connectDatabase;
