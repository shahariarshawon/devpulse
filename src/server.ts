import app from "./app";
import { env } from "./config/env";
import { pool } from "./config/db";

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    console.log("Database connected successfully");

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.log("Database connection failed");
    console.log(error);
  }
};

startServer();
