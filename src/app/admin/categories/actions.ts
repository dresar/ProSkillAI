"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { categories, auditLog } from "@/db/schema";
import { requireAdmin, requireAdminOrEditor } from "@/lib/auth";
import { eq } from "drizzle-orm";

const categorySchema = z.object({
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  nameId: z.string().min(2, "Nama Indonesia wajib diisi"),
  nameEn: z.string().min(2, "Nama Inggris wajib diisi"),
  descriptionId: z.string().optional(),
  descriptionEn: z.string().optional(),
  type: z.enum(["skill", "prompt", "all"]).default("all"),
});

export async function createCategoryAction(prevState: unknown, formData: FormData) {
  const user = await requireAdminOrEditor();

  const raw = {
    slug: formData.get("slug") as string,
    nameId: formData.get("nameId") as string,
    nameEn: formData.get("nameEn") as string,
    descriptionId: (formData.get("descriptionId") as string) || undefined,
    descriptionEn: (formData.get("descriptionEn") as string) || undefined,
    type: (formData.get("type") as "skill" | "prompt" | "all") || "all",
  };

  const val = categorySchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const existing = await db.select().from(categories).where(eq(categories.slug, val.data.slug)).limit(1);
  if (existing.length > 0) {
    return { error: "Slug kategori sudah digunakan." };
  }

  const id = `cat-${randomBytes(8).toString("hex")}`;
  await db.insert(categories).values({
    id,
    ...val.data,
    createdAt: new Date(),
  });

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "CREATE_CATEGORY",
    entityType: "category",
    entityId: id,
    details: { name: val.data.nameId },
    createdAt: new Date(),
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const user = await requireAdmin();

  await db.delete(categories).where(eq(categories.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "DELETE_CATEGORY",
    entityType: "category",
    entityId: id,
    createdAt: new Date(),
  });

  revalidatePath("/admin/categories");
}
