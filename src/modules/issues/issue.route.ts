import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { createIssueController } from "./issue.controller";

const router = Router();

router.post("/", authMiddleware, createIssueController);

export default router;
