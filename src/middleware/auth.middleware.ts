import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const checkBearer = authHeader.split(" ");
      if (checkBearer[0] !== "Bearer" || !checkBearer[1]) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const token = checkBearer[1];
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
      const decodeToken = jwt.verify(
        token,
        config.jwtSecret as string
      ) as jwt.JwtPayload;
      req.user = decodeToken;

      if (roles.length && !roles.includes(decodeToken.role)) {
        return res.status(403).json({
          error: "unauthorzed access",
        });
      }
      next();
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  };
};
export default auth;
