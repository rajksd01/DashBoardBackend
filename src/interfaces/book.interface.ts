import mongoose from "mongoose";

interface Book {
  _id: string;
  title: string;
  author: mongoose.Types.ObjectId ;
  genre: string;
  coverImage: string;
  file: string;
  NumberOfPages: number;
  createdAt: Date;
  updatedAt: Date;
}

export default Book;
