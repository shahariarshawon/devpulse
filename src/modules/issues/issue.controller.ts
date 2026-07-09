import { Request, Response, NextFunction } from "express";

import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
} from "./issue.service";
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

export const getAllIssuesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issues = await getAllIssues(req.query as any);

    sendResponse(res, 200, {
      success: true,
      message: "Issues retrived successfully",
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleIssueController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issue = await getSingleIssue(Number(req.params.id));

    sendResponse(res, 200, {
      success: true,
      message: "Issue retrived successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIssueController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issue = await updateIssue(
      Number(req.params.id),

      req.body,

      {
        id: req.user!.id,
        role: req.user!.role,
      },
    );

    sendResponse(res, 200, {
      success: true,
      message: "Issue updated successfully",
      data: issue,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIssueController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteIssue(
      Number(req.params.id),

      req.user!.role,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
