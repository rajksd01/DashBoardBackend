"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const node_path_1 = __importDefault(require("node:path"));
const bookRouter = express_1.default.Router();
const book_controller_1 = require("../../controllers/book.controller");
const authenticate_middleware_1 = require("../../middlewares/authenticate.middleware");
const upload = (0, multer_1.default)({
    dest: node_path_1.default.resolve(__dirname, "../../../public/data/uploads"),
    limits: { fileSize: 3e7 },
});
bookRouter.post("/add", authenticate_middleware_1.authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), book_controller_1.addBook);
bookRouter.patch("/update/:bookId", authenticate_middleware_1.authenticate, upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
]), book_controller_1.updateBook);
bookRouter.get("/", book_controller_1.getAllBooks);
bookRouter.get("/:id", book_controller_1.getBookDetails);
bookRouter.delete("/deleteBook/:id", authenticate_middleware_1.authenticate, book_controller_1.deleteBook);
exports.default = bookRouter;
