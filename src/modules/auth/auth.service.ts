import bcrypt from "bcrypt";
import { pool } from "../../config/db";
import { AppError } from "../../utils/AppError";
import JsonWebTokenError from "jsonwebtoken";

interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: "contributor" | "maintainer";
}

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (loginData: LoginData) => {
  const { email, password } = loginData;

  // Find user

  const result = await pool.query(
    `
        SELECT 
        id,
        name,
        email,
        password,
        role,
        created_at,
        updated_at
        FROM users
        WHERE email=$1
        `,
    [email],
  );

  if (result.rows.length === 0) {
    throw new AppError(401, "Invalid email or password");
  }

  const user = result.rows[0];

  // Compare password

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  // Generate JWT

  const token = JsonWebTokenError.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  };
};

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
