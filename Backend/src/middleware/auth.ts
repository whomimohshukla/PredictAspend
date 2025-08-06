import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";
import { asyncHandler } from "../utils/handler";

interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      
      // Get user from database
      const user = await UserModel.findById(decoded.sub);
      if (!user) {
        return res.status(401).json({ message: "Token is invalid." });
      }

      if (user.disabled) {
        return res.status(403).json({ message: "Account is disabled." });
      }

      // Attach user to request
      (req as any).user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid." });
    }
  }
);

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ message: "Access denied." });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Insufficient permissions." });
    }

    next();
  };
};