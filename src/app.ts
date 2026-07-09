import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware";
import authRoute from "./modules/auth/auth.route";

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

app.use(errorHandler);

export default app;
