import express from "express";
import { registerUser, loginUser } from "../../controllers/user.controller";
const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
//userRouter.get("/user/:id", getUserDetails);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
