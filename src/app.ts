import express from "express";
import globalErrorHandler from "./middlewares/GlobalErrorHandler";
import userRouter from "./routes/v1/UserRoutes";
import bookRouter from "./routes/v1/BookRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/books", bookRouter);
app.use("/api/v1", userRouter);

app.get("/", (req, res) => {
  res.send("Server started");
});

// global event handler

app.use(globalErrorHandler);

export default app;
