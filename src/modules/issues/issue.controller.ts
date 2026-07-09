import { Request, Response, NextFunction } from "express";

import { createIssue } from "./issue.service";
import { sendResponse } from "../../utils/sendResponse";

export const createIssueController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issue = await createIssue({
      ...req.body,

      reporter_id: req.user!.id,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Issue created successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};
