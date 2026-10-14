import type { Request, Response, NextFunction } from "express";
import { SESSION_COOKIE, verifySessionToken } from "../auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string" && verifySessionToken(token)) {
    next();
    return;
  }
  res.status(401).json({ error: "Not authenticated" });
}
