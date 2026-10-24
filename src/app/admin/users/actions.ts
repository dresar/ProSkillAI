"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { users, auditLog } from "@/db/schema";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { and, eq, ne } from "drizzle-orm";

const userSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["admin", "user", "editor"]).default("user"),
  aiCredits: z.number().int().min(0).default(10),
});

export async function createUserAction(prevState: unknown, formData: FormData) {
  const admin = await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: (formData.get("role") as "admin" | "user" | "editor") || "user",
    aiCredits: Number(formData.get("aiCredits") || 10),
  };

  const val = userSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const existing = await db.select().from(users).where(eq(users.email, val.data.email)).limit(1);
  if (existing.length > 0) {
    return { error: "Email sudah terdaftar." };
  }

  const id = randomBytes(16).toString("hex");
  const passwordHash = await hashPassword(val.data.password);

  await db.insert(users).values({
    id,
    name: val.data.name,
    email: val.data.email,
    passwordHash,
    role: val.data.role,
    aiCredits: val.data.aiCredits,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: admin.id,
    userEmail: admin.email,
    action: "CREATE_USER",
    entityType: "user",
    entityId: id,
    details: { email: val.data.email, role: val.data.role },
    createdAt: new Date(),
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserAction(
  userId: string,
  data: {
    name: string;
    email: string;
    role: "admin" | "user" | "editor";
    aiCredits: number;
  }
) {
  const admin = await requireAdmin();

  if (userId === admin.id && data.role !== "admin") {
    return { error: "Anda tidak dapat menurunkan role akun Anda sendiri." };
  }

  const duplicate = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, data.email), ne(users.id, userId)))
    .limit(1);

  if (duplicate.length > 0) {
    return { error: "Email sudah digunakan oleh akun lain." };
  }

  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      role: data.role,
      aiCredits: data.aiCredits,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: admin.id,
    userEmail: admin.email,
    action: "UPDATE_USER",
    entityType: "user",
    entityId: userId,
    details: { email: data.email, role: data.role, aiCredits: data.aiCredits },
    createdAt: new Date(),
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function resetUserPasswordAction(userId: string, newPassword: string) {
  const admin = await requireAdmin();

  if (newPassword.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: admin.id,
    userEmail: admin.email,
    action: "RESET_USER_PASSWORD",
    entityType: "user",
    entityId: userId,
    createdAt: new Date(),
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();

  if (userId === admin.id) {
    return { error: "Anda tidak dapat menghapus akun Anda sendiri saat sedang masuk." };
  }

  await db.delete(users).where(eq(users.id, userId));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: admin.id,
    userEmail: admin.email,
    action: "DELETE_USER",
    entityType: "user",
    entityId: userId,
    createdAt: new Date(),
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRoleAction(userId: string, newRole: "admin" | "user" | "editor") {
  const admin = await requireAdmin();

  if (userId === admin.id && newRole !== "admin") {
    return { error: "Anda tidak dapat mengubah atau menurunkan role akun Anda sendiri." };
  }

  await db
    .update(users)
    .set({
      role: newRole,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: admin.id,
    userEmail: admin.email,
    action: "UPDATE_USER_ROLE",
    entityType: "user",
    entityId: userId,
    details: { newRole },
    createdAt: new Date(),
  });

  revalidatePath("/admin/users");
  return { success: true };
}
