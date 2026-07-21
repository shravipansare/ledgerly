import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";



export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const secret = process.env.JWT_SECRET || "fallback_secret";
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token." });
      return;
    }
    req.user = decoded;
    next();
  });
};
