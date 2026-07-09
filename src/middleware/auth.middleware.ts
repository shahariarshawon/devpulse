import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, "Authentication token required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded as Request["user"];

    next();
  } catch (error) {
    next(new AppError(401, "Invalid or expired token"));
  }
};
