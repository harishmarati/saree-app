import type { Request, Response, NextFunction } from "express";
import { extractToken, verifySessionToken } from "../auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token && verifySessionToken(token)) {
    next();
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
}
