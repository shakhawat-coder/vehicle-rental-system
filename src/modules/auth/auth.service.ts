import { pool } from "../../database/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUpUser = async (payload: Record<string, unknown>) => {
  let { name, email, role, password, phone } = payload;
  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }
  email = (email as string).toLowerCase();
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, role, password, phone) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, role, hashedPassword, phone]
  );
  delete result.rows[0].password;
  return result;
};

const signinUser = async (email: string, password: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials");
  }

  const secret = config.jwtSecret as string;
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  );
  delete user.password;
  return { token, user };
};

export const authService = {
  signUpUser,
  signinUser,
};
