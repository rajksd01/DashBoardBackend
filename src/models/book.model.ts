import mongoose from "mongoose";
import Book from "../interfaces/book.interface";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {

      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
      unique: true,
    },
    genre: {
      type: String,
      required: true,
    },
    NumberOfPages: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model<Book>("Book", bookSchema);
export default Book;
