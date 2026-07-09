import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

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
