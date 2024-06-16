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
exports.deleteBook = exports.getBookDetails = exports.getAllBooks = exports.updateBook = exports.addBook = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const node_path_1 = __importDefault(require("node:path"));
const Cloudinary_1 = __importDefault(require("../config/Cloudinary"));
const book_model_1 = __importDefault(require("../models/book.model"));
const fs_1 = __importDefault(require("fs"));
const addBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre, title } = req.body;
    const files = req.files;
    let filepath, bookFilePath;
    let bookImageUrlPath, bookUrlPath;
    try {
        // Uploading books cover image to cloudinary
        const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
        const FileName = files.coverImage[0].filename;
        filepath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", FileName);
        const uploadResult = yield Cloudinary_1.default.uploader.upload(filepath, {
            filename_override: FileName,
            folder: "book-cover",
            format: coverImageMimeType,
        });
        bookImageUrlPath = uploadResult.secure_url;
        // Uploading books to Cloudinary
        const bookFileName = files.file[0].filename;
        bookFilePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads", bookFileName);
        const PdfMimeType = files.file[0].mimetype.split("/").at(-1);
        const BookUploadResult = yield Cloudinary_1.default.uploader.upload(bookFilePath, {
            resource_type: "raw",
            filename_override: bookFileName,
            folder: "book-pdf",
            format: PdfMimeType,
        });
        bookUrlPath = BookUploadResult.secure_url;
    }
    catch (error) {
        console.log(error);
        return next((0, http_errors_1.default)(401, "Error While Uploading Files"));
    }
    // deleting books from the server after it has been pushed to cloudinary
    try {
        // unlinking images
        fs_1.default.promises.unlink(filepath);
        // unlinking bookpath
        fs_1.default.promises.unlink(bookFilePath);
    }
    catch (error) {
        console.log(error);
        next((0, http_errors_1.default)(500, "File Deletion Error from Server"));
    }
    // pushing book details to Mongo Database
    const _req = req;
    try {
        const bookUploaded = yield book_model_1.default.create({
            title,
            genre,
            author: _req.userId,
            coverImage: bookImageUrlPath,
            file: bookUrlPath,
        });
        return res.send({
            id: bookUploaded._id,
        });
    }
    catch (error) {
        console.log(error);
        return next((0, http_errors_1.default)(500, "File Upload Details Failed To Configure"));
    }
});
exports.addBook = addBook;
// for updating a book
const updateBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, genre } = req.body;
        const bookId = req.params.bookId;
        let book;
        try {
            book = yield book_model_1.default.findOne({ _id: bookId });
            if (!book) {
                return next((0, http_errors_1.default)(404, "Book Not Found"));
            }
            const _req = req;
            if (book.author.toString() !== _req.userId) {
                return next((0, http_errors_1.default)(403, "You are not allowed to update this book"));
            }
        }
        catch (error) {
            console.log(error);
            return next((0, http_errors_1.default)(404, "Something went wrong while updating the book either book not found or user donot have necessary permissions."));
        }
        const files = req.files;
        // updating the image cover
        let completeCoverImage = "";
        if (files.coverImage) {
            const coverImageFilename = files.coverImage[0].filename;
            const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
            const filePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads/" + coverImageFilename);
            completeCoverImage = coverImageFilename;
            const uploadResult = yield Cloudinary_1.default.uploader.upload(filePath, {
                filename_override: completeCoverImage,
                folder: "book-cover",
                format: converMimeType,
            });
            completeCoverImage = uploadResult.secure_url;
            yield fs_1.default.promises.unlink(filePath);
        }
        // updating the book file
        let completeBook = "";
        if (files.file) {
            const bookFileName = files.file[0].filename;
            const fileMimeType = files.file[0].mimetype.split("/").at(-1);
            const bookFilePath = node_path_1.default.resolve(__dirname, "../../public/data/uploads/" + bookFileName);
            const bookUploadResult = yield Cloudinary_1.default.uploader.upload(bookFilePath, {
                filename_override: bookFileName,
                folder: "book-pdf",
                format: fileMimeType,
            });
            completeBook = bookUploadResult.secure_url;
            yield fs_1.default.promises.unlink(bookFilePath);
        }
        const updateBookDetails = yield book_model_1.default.findOneAndUpdate({ _id: bookId }, {
            title: title,
            genre: genre,
            coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
            file: completeBook ? completeBook : book.file,
        }, {
            new: true,
        });
        return res.status(200).json(updateBookDetails);
    }
    catch (error) {
        console.error(error);
        return next((0, http_errors_1.default)(500, "Book details Update Failed"));
    }
});
exports.updateBook = updateBook;
// to get all books
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Books = yield book_model_1.default.find();
        return res.status(200).json({
            message: Books,
        });
    }
    catch (error) {
        console.log(error);
        return next((0, http_errors_1.default)(500, "Cannot fetch books"));
    }
});
exports.getAllBooks = getAllBooks;
const getBookDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    try {
        const bookDetails = yield book_model_1.default.findOne({
            _id: bookId,
        });
        return res.status(200).json({ message: bookDetails });
    }
    catch (error) {
        return next((0, http_errors_1.default)(500, "Book Details cannot be fetched"));
    }
});
exports.getBookDetails = getBookDetails;
// to delete a book
const deleteBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const bookId = req.params.id;
        const bookToDelete = yield book_model_1.default.findOne({
            _id: bookId,
        });
        if (!bookToDelete) {
            return next((0, http_errors_1.default)(404, "Book Doesnot Exist"));
        }
        const _req = req;
        if (_req.userId !== bookToDelete.author.toString()) {
            return next((0, http_errors_1.default)(400, "Donot have Permission To Delete the Book "));
        }
        // deleting coverImage from cloudinary
        const ImageSplit = bookToDelete.coverImage.split("/");
        const coverImagePublicId = ImageSplit.at(-2) + "/" + ((_a = ImageSplit.at(-1)) === null || _a === void 0 ? void 0 : _a.split(".").at(-2));
        yield Cloudinary_1.default.uploader.destroy(coverImagePublicId);
        // deleting file from cloudinary
        const bookFileSplit = bookToDelete.file.split("/");
        const bookPublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
        yield Cloudinary_1.default.uploader.destroy(bookPublicId, {
            resource_type: "raw",
        });
        // deleting record from database
        yield book_model_1.default.deleteOne({
            _id: bookId,
        });
        return res.status(204).json({
            message: `${bookId} deleted successfully`,
        });
    }
    catch (error) {
        next((0, http_errors_1.default)(500, "Book Deletion Failed"));
    }
});
exports.deleteBook = deleteBook;
