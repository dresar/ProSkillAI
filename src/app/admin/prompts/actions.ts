"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { prompts, auditLog } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";

const promptFormSchema = z.object({
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  titleId: z.string().min(2, "Judul Indonesia wajib diisi"),
  titleEn: z.string().min(2, "Judul Inggris wajib diisi"),
  descriptionId: z.string().min(5, "Deskripsi Indonesia minimal 5 karakter"),
  descriptionEn: z.string().min(5, "Deskripsi Inggris minimal 5 karakter"),
  contentId: z.string().min(10, "Isi prompt Indonesia minimal 10 karakter"),
  contentEn: z.string().min(10, "Isi prompt Inggris minimal 10 karakter"),
  categoryId: z.string().nullable().optional(),
  variables: z.any().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function createPromptAction(prevState: unknown, formData: FormData) {
  const user = await requireAuth();

  let variablesData = [];
  const rawVars = formData.get("variablesJson") as string;
  if (rawVars) {
    try {
      variablesData = JSON.parse(rawVars);
    } catch {
      variablesData = [];
    }
  }

  const raw = {
    slug: formData.get("slug") as string,
    titleId: formData.get("titleId") as string,
    titleEn: formData.get("titleEn") as string,
    descriptionId: formData.get("descriptionId") as string,
    descriptionEn: formData.get("descriptionEn") as string,
    contentId: formData.get("contentId") as string,
    contentEn: formData.get("contentEn") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    variables: variablesData,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = promptFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const existing = await db.select().from(prompts).where(eq(prompts.slug, val.data.slug)).limit(1);
  if (existing.length > 0) {
    return { error: "Slug sudah digunakan." };
  }

  const newId = randomBytes(16).toString("hex");

  await db.insert(prompts).values({
    id: newId,
    ...val.data,
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "CREATE_PROMPT",
    entityType: "prompt",
    entityId: newId,
    details: { slug: val.data.slug, status: val.data.status },
    createdAt: new Date(),
  });

  revalidatePath("/admin/prompts");
  revalidatePath("/id/prompts");
  revalidatePath("/en/prompts");
  redirect("/admin/prompts");
}

export async function updatePromptAction(id: string, prevState: unknown, formData: FormData) {
  const user = await requireAuth();

  let variablesData = [];
  const rawVars = formData.get("variablesJson") as string;
  if (rawVars) {
    try {
      variablesData = JSON.parse(rawVars);
    } catch {
      variablesData = [];
    }
  }

  const raw = {
    slug: formData.get("slug") as string,
    titleId: formData.get("titleId") as string,
    titleEn: formData.get("titleEn") as string,
    descriptionId: formData.get("descriptionId") as string,
    descriptionEn: formData.get("descriptionEn") as string,
    contentId: formData.get("contentId") as string,
    contentEn: formData.get("contentEn") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    variables: variablesData,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = promptFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  await db
    .update(prompts)
    .set({
      ...val.data,
      updatedAt: new Date(),
    })
    .where(eq(prompts.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "UPDATE_PROMPT",
    entityType: "prompt",
    entityId: id,
    details: { slug: val.data.slug, status: val.data.status },
    createdAt: new Date(),
  });

  revalidatePath("/admin/prompts");
  revalidatePath(`/admin/prompts/${id}/edit`);
  revalidatePath(`/id/prompts/${val.data.slug}`);
  revalidatePath(`/en/prompts/${val.data.slug}`);

  return { success: true };
}

export async function deletePromptAction(id: string) {
  const user = await requireAuth();

  await db.delete(prompts).where(eq(prompts.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "DELETE_PROMPT",
    entityType: "prompt",
    entityId: id,
    createdAt: new Date(),
  });

  revalidatePath("/admin/prompts");
  revalidatePath("/id/prompts");
  revalidatePath("/en/prompts");
}
