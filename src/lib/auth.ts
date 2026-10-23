import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { eq, and, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions, loginAttempts, type User } from "@/db/schema";

const scryptAsync = promisify(scrypt);

const SESSION_COOKIE_NAME = "proskillai_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, key] = parts;
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  if (keyBuffer.length !== derivedKey.length) return false;
  return timingSafeEqual(keyBuffer, derivedKey);
}

export async function checkRateLimit(ip: string, email: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60 * 1000);
  const attempts = await db
    .select({ count: sql<number>`count(*)` })
    .from(loginAttempts)
    .where(
      and(
        sql`(${loginAttempts.ip} = ${ip} OR ${loginAttempts.email} = ${email})`,
        gt(loginAttempts.attemptedAt, windowStart)
      )
    );
  const count = Number(attempts[0]?.count ?? 0);
  return count < MAX_LOGIN_ATTEMPTS;
}

export async function recordLoginAttempt(ip: string, email: string): Promise<void> {
  await db.insert(loginAttempts).values({
    id: randomBytes(16).toString("hex"),
    ip,
    email,
    attemptedAt: new Date(),
  });
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.insert(sessions).values({
    id: randomBytes(16).toString("hex"),
    userId,
    token,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const result = await db
      .select({
        user: users,
        session: sessions,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
      .limit(1);

    if (result.length === 0) return null;
    return result[0].user;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function requireAdminOrEditor(): Promise<User> {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "editor") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
