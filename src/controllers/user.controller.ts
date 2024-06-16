import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import UserModel from "../models/user.model";
import { config } from "../config/ServerConfig";
import User from "../interfaces/user.interface";

// registering a user

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    next(error);
  }
  try {
    const emailExist = await UserModel.findOne({ email: email });
    if (emailExist != null) {
      const error = createHttpError(
        401,
        "User Already Exists, Please try to login instead"
      );
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
  const encryptedPassword = await bcrypt.hash(password, config.SALTROUNDS);
  const savedUser = await UserModel.create({
    name,
    email,
    password: encryptedPassword,
  });
  const { id } = savedUser;
  // generating token
  const token = jwt.sign({ id, name, email }, config.JWTSECRET as string);
  return res.status(200).json({
    userId: savedUser._id,
    token,
  });
};

// signing a user

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  let user: User | null;
  try {
    user = await UserModel.findOne({
      email: email,
    });
    console.log("user find done", user);
    if (user == null) {
      const error = createHttpError(404, "Email Doesnot Exist");
      return next(error);
    }
    const match = await bcrypt.compare(password, user.password);
    console.log("match  done", match);

    if (!match) {
      const error = createHttpError(400, "Password Invalid");
      return res.status(400).json({
        message: error,
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email },
      config.JWTSECRET as string
    );
  
    return res.json({
      userId: user._id,
      token,
    });
  } catch (error) {
    return error;
  }
};

export { registerUser, loginUser };
