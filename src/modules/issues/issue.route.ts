import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController,
} from "./issue.controller";

const router = Router();

router.post("/", authMiddleware, createIssueController);
router.get("/", getAllIssuesController);
router.get("/:id", getSingleIssueController);
router.patch("/:id", authMiddleware, updateIssueController);
router.delete("/:id", authMiddleware, deleteIssueController);
export default router;
