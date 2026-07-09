import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";
import authRoute from "./modules/auth/auth.route";
import issueRoute from "./modules/issues/issue.route";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevPulse API is running",
  });
});
app.use("/api/auth", authRoute);
app.use(
    "/api/issues",
    issueRoute
);

app.use(errorHandler);

export default app;
