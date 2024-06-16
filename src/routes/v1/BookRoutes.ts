import express from "express";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookDetails,
  updateBook,
} from "../../controllers/book.controller";
import { authenticate } from "../../middlewares/authenticate.middleware";

const upload = multer({
  dest: path.resolve(__dirname, "../../../public/data/uploads"),
  limits: { fileSize: 3e7 },
});

bookRouter.post(
  "/add",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  addBook
);
bookRouter.patch(
  "/update/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);
bookRouter.get("/", getAllBooks);

bookRouter.get("/:id", getBookDetails);
bookRouter.delete("/deleteBook/:id", authenticate, deleteBook);

export default bookRouter;
