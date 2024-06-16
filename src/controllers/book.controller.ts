import createHttpError from "http-errors";
import path from "node:path";
import { Request, Response, NextFunction, raw } from "express";
import cloudinary from "../config/Cloudinary";
import Book from "../models/book.model";
import fs from "fs";
import IBook from "../interfaces/book.interface";

// for handling user Id
interface AuthRequest extends Request {
  userId: string;
}

const addBook = async (req: Request, res: Response, next: NextFunction) => {
  const { genre, title } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let filepath: string, bookFilePath: string;
  let bookImageUrlPath: string, bookUrlPath: string;

  try {
    // Uploading books cover image to cloudinary
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const FileName = files.coverImage[0].filename;
    filepath = path.resolve(__dirname, "../../public/data/uploads", FileName);

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      filename_override: FileName,
      folder: "book-cover",
      format: coverImageMimeType,
    });
    bookImageUrlPath = uploadResult.secure_url;

    // Uploading books to Cloudinary
    const bookFileName = files.file[0].filename;

    bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    const PdfMimeType = files.file[0].mimetype.split("/").at(-1);

    const BookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdf",
      format: PdfMimeType,
    });
    bookUrlPath = BookUploadResult.secure_url;
  } catch (error) {
    console.log(error);
    return next(createHttpError(401, "Error While Uploading Files"));
  }
  // deleting books from the server after it has been pushed to cloudinary

  try {
    // unlinking images
    fs.promises.unlink(filepath);
    // unlinking bookpath
    fs.promises.unlink(bookFilePath);
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "File Deletion Error from Server"));
  }

  // pushing book details to Mongo Database

  const _req = req as AuthRequest;

  try {
    const bookUploaded = await Book.create({
      title,
      genre,
      author: _req.userId,
      coverImage: bookImageUrlPath,
      file: bookUrlPath,
    });
    return res.send({
      id: bookUploaded._id,
    });
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(500, "File Upload Details Failed To Configure")
    );
  }
};

// for updating a book

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;
    let book: IBook | null;
    try {
      book = await Book.findOne({ _id: bookId });
      if (!book) {
        return next(createHttpError(404, "Book Not Found"));
      }
      const _req = req as AuthRequest;
      if (book.author.toString() !== _req.userId) {
        return next(
          createHttpError(403, "You are not allowed to update this book")
        );
      }
    } catch (error) {
      console.log(error);
      return next(
        createHttpError(
          404,
          "Something went wrong while updating the book either book not found or user donot have necessary permissions."
        )
      );
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    // updating the image cover
    let completeCoverImage = "";
    if (files.coverImage) {
      const coverImageFilename = files.coverImage[0].filename;
      const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + coverImageFilename
      );
      completeCoverImage = coverImageFilename;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImage,
        folder: "book-cover",
        format: converMimeType,
      });

      completeCoverImage = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    // updating the book file

    let completeBook = "";
    if (files.file) {
      const bookFileName = files.file[0].filename;
      const fileMimeType = files.file[0].mimetype.split("/").at(-1);
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads/" + bookFileName
      );

      const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
        filename_override: bookFileName,
        folder: "book-pdf",
        format: fileMimeType,
      });
      completeBook = bookUploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }
    const updateBookDetails = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeBook ? completeBook : book.file,
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updateBookDetails);
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Book details Update Failed"));
  }
};

// to get all books
const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Books = await Book.find();
    return res.status(200).json({
      message: Books,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Cannot fetch books"));
  }
};

const getBookDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.id;
  try {
    const bookDetails = await Book.findOne({
      _id: bookId,
    });
    return res.status(200).json({ message: bookDetails });
  } catch (error) {
    return next(createHttpError(500, "Book Details cannot be fetched"));
  }
};

// to delete a book
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.id;
    const bookToDelete = await Book.findOne({
      _id: bookId,
    });
    if (!bookToDelete) {
      return next(createHttpError(404, "Book Doesnot Exist"));
    }
    const _req = req as AuthRequest;
    if (_req.userId !== bookToDelete.author.toString()) {
      return next(
        createHttpError(400, "Donot have Permission To Delete the Book ")
      );
    }
    // deleting coverImage from cloudinary
    const ImageSplit = bookToDelete.coverImage.split("/");
    const coverImagePublicId =
      ImageSplit.at(-2) + "/" + ImageSplit.at(-1)?.split(".").at(-2);

    await cloudinary.uploader.destroy(coverImagePublicId);

    // deleting file from cloudinary
    const bookFileSplit = bookToDelete.file.split("/");
    const bookPublicId = bookFileSplit.at(-2) + "/" + bookFileSplit.at(-1);
    await cloudinary.uploader.destroy(bookPublicId, {
      resource_type: "raw",
    });

    // deleting record from database
    await Book.deleteOne({
      _id: bookId,
    });

    return res.status(204).json({
      message: `${bookId} deleted successfully`,
    });
  } catch (error) {
    next(createHttpError(500, "Book Deletion Failed"));
  }
};

export { addBook, updateBook, getAllBooks, getBookDetails, deleteBook };
