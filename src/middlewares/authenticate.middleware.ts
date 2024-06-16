import { Request, Response, NextFunction } from "express";
import { config } from "../config/ServerConfig";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

// for handling user Id
interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return next(
        createHttpError(401, "You are not allowed to perform this action")
      );
    }
    const parsedToken = token.split(" ")[1];
    const decoded = jwt.verify(parsedToken, config.JWTSECRET as string);
    if (typeof decoded !== "string" && "id" in decoded) {
      const _req = req as AuthRequest;
      _req.userId = decoded.id as string;

      next();
    } else {
      throw new Error("Invalid token format");
    }
  } catch (error) {
    console.log(error);
    return next(createHttpError(401, "Token Expired, Resignin and Continue"));
  }
};

export { authenticate };
