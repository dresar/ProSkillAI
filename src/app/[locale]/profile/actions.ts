"use server";

import { z } from "zod";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, auditLog } from "@/db/schema";
import { requireAuth, verifyPassword, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const updateNameSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(60, "Nama maksimal 60 karakter"),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
  confirmPassword: z.string().min(8, "Konfirmasi kata sandi minimal 8 karakter"),
});

export async function updateProfileNameAction(_prevState: unknown, formData: FormData) {
  try {
    const user = await requireAuth();
    const rawName = (formData.get("name") as string) || "";

    const validation = updateNameSchema.safeParse({ name: rawName });
    if (!validation.success) {
      return {
        error: validation.error.issues[0]?.message || "Input nama tidak valid",
      };
    }

    const newName = validation.data.name;

    await db
      .update(users)
      .set({
        name: newName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await db.insert(auditLog).values({
      id: randomBytes(16).toString("hex"),
      userId: user.id,
      userEmail: user.email,
      action: "UPDATE_PROFILE_NAME",
      entityType: "user",
      entityId: user.id,
      details: { oldName: user.name, newName },
      createdAt: new Date(),
    });

    revalidatePath("/id/profile");
    revalidatePath("/en/profile");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Nama profil berhasil diperbarui.",
      name: newName,
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Gagal memperbarui profil.",
    };
  }
}

export async function updatePasswordAction(_prevState: unknown, formData: FormData) {
  try {
    const user = await requireAuth();

    const currentPassword = (formData.get("currentPassword") as string) || "";
    const newPassword = (formData.get("newPassword") as string) || "";
    const confirmPassword = (formData.get("confirmPassword") as string) || "";

    const validation = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      return {
        error: validation.error.issues[0]?.message || "Input kata sandi tidak valid",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        error: "Konfirmasi kata sandi baru tidak cocok.",
      };
    }

    if (currentPassword === newPassword) {
      return {
        error: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini.",
      };
    }

    const isValidCurrent = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidCurrent) {
      return {
        error: "Kata sandi saat ini tidak sesuai.",
      };
    }

    const newHash = await hashPassword(newPassword);

    await db
      .update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await db.insert(auditLog).values({
      id: randomBytes(16).toString("hex"),
      userId: user.id,
      userEmail: user.email,
      action: "UPDATE_PASSWORD",
      entityType: "user",
      entityId: user.id,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Kata sandi berhasil diubah dengan aman.",
    };
  } catch (err: unknown) {
    return {
      error: err instanceof Error ? err.message : "Gagal memperbarui kata sandi.",
    };
  }
}
