"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GlobalErrorHandler_1 = __importDefault(require("./middlewares/GlobalErrorHandler"));
const UserRoutes_1 = __importDefault(require("./routes/v1/UserRoutes"));
const BookRoutes_1 = __importDefault(require("./routes/v1/BookRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/books", BookRoutes_1.default);
app.use("/api/v1", UserRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Server started");
});
// global event handler
app.use(GlobalErrorHandler_1.default);
exports.default = app;
