import { Request, Response, NextFunction } from "express";
import { loginUser, signupUser } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await signupUser(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUser(req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
