import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  connecionString: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
