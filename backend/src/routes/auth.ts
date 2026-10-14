import { Router, type Request, type Response } from "express";
import { SESSION_COOKIE, getAdminPassword, safeCompare, signSessionToken, verifySessionToken } from "../auth.js";

export const authRouter = Router();

function cookieOptions(req: Request) {
  const secure = req.secure;
  return {
    httpOnly: true,
    secure,
    sameSite: (secure ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

authRouter.post("/login", (req: Request, res: Response) => {
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (!password || !safeCompare(password, getAdminPassword())) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = signSessionToken();
  res.cookie(SESSION_COOKIE, token, {
    ...cookieOptions(req),
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

authRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, cookieOptions(req));
  res.json({ ok: true });
});

authRouter.get("/me", (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (typeof token === "string" && verifySessionToken(token)) {
    res.json({ authenticated: true });
    return;
  }
  res.status(401).json({ authenticated: false });
});
