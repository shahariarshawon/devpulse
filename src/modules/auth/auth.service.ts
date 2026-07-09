import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";

interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

export const signupUser = async (userData: SignupData) => {
  const { name, email, password, role = "contributor" } = userData;

  // Check existing email

  const existingUser = await pool.query("SELECT id FROM users WHERE email=$1", [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    throw new AppError(400, "Email already exists");
  }

  // Hash password

  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert user

  const result = await pool.query(
    `
        INSERT INTO users
        (name,email,password,role)
        VALUES($1,$2,$3,$4)
        RETURNING 
        id,
        name,
        email,
        role,
        created_at,
        updated_at
        `,
    [name, email, hashedPassword, role],
  );

  return result.rows[0];
};
