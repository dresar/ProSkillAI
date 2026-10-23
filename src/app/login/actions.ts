"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createSession, destroySession, checkRateLimit, recordLoginAttempt } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function loginAction(prevState: unknown, formData: FormData) {
  const emailRaw = formData.get("email");
  const passwordRaw = formData.get("password");

  const validation = loginSchema.safeParse({
    email: emailRaw,
    password: passwordRaw,
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Input tidak valid",
    };
  }

  const { email, password } = validation.data;
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";

  const allowed = await checkRateLimit(ip, email);
  if (!allowed) {
    return {
      error: "Terlalu banyak percobaan login gagal. Harap tunggu 15 menit sebelum mencoba lagi.",
    };
  }

  const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = foundUsers[0];

  if (!user) {
    await recordLoginAttempt(ip, email);
    return {
      error: "Email atau password salah.",
    };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    await recordLoginAttempt(ip, email);
    return {
      error: "Email atau password salah.",
    };
  }

  await createSession(user.id);
  return { success: true, role: user.role };
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
