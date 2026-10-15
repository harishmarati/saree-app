import crypto from "node:crypto";
import jwt from "jsonwebtoken";

export const SESSION_COOKIE = "saree_session";

// Accepts the Bearer header (works on mobile browsers that block cross-site
// cookies) or falls back to the session cookie.
export function extractToken(req: { headers: { authorization?: string }; cookies?: Record<string, unknown> }): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookie = req.cookies?.[SESSION_COOKIE];
  return typeof cookie === "string" ? cookie : null;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getAdminPassword(): string {
  return requiredEnv("ADMIN_PASSWORD");
}

export function getJwtSecret(): string {
  return requiredEnv("JWT_SECRET");
}

export function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a timing-safe compare against something of matching length
    // so failure timing doesn't trivially leak the real length.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function signSessionToken(): string {
  return jwt.sign({ role: "admin" }, getJwtSecret(), { expiresIn: "30d" });
}

export function verifySessionToken(token: string): boolean {
  try {
    jwt.verify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}
