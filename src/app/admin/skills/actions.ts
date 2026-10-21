"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { skills, auditLog } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { eq } from "drizzle-orm";

const skillFormSchema = z.object({
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  titleId: z.string().min(2, "Judul Indonesia wajib diisi"),
  titleEn: z.string().min(2, "Judul Inggris wajib diisi"),
  summaryId: z.string().min(5, "Ringkasan Indonesia minimal 5 karakter"),
  summaryEn: z.string().min(5, "Ringkasan Inggris minimal 5 karakter"),
  contentId: z.string().min(10, "Konten Indonesia minimal 10 karakter"),
  contentEn: z.string().min(10, "Konten Inggris minimal 10 karakter"),
  categoryId: z.string().nullable().optional(),
  sourceType: z.enum(["original", "github"]).default("original"),
  repoUrl: z.string().nullable().optional(),
  filePath: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorUrl: z.string().nullable().optional(),
  attribution: z.string().nullable().optional(),
  previewType: z.enum(["none", "html", "image", "tokens"]).default("none"),
  previewHtml: z.string().nullable().optional(),
  previewImageUrl: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function createSkillAction(prevState: unknown, formData: FormData) {
  const user = await requireAuth();

  const raw = {
    slug: formData.get("slug") as string,
    titleId: formData.get("titleId") as string,
    titleEn: formData.get("titleEn") as string,
    summaryId: formData.get("summaryId") as string,
    summaryEn: formData.get("summaryEn") as string,
    contentId: formData.get("contentId") as string,
    contentEn: formData.get("contentEn") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    sourceType: (formData.get("sourceType") as "original" | "github") || "original",
    repoUrl: (formData.get("repoUrl") as string) || null,
    filePath: (formData.get("filePath") as string) || null,
    license: (formData.get("license") as string) || null,
    authorName: (formData.get("authorName") as string) || null,
    authorUrl: (formData.get("authorUrl") as string) || null,
    attribution: (formData.get("attribution") as string) || null,
    previewType: (formData.get("previewType") as "none" | "html" | "image" | "tokens") || "none",
    previewHtml: (formData.get("previewHtml") as string) || null,
    previewImageUrl: (formData.get("previewImageUrl") as string) || null,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = skillFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const existing = await db.select().from(skills).where(eq(skills.slug, val.data.slug)).limit(1);
  if (existing.length > 0) {
    return { error: "Slug sudah digunakan, harap gunakan slug lain." };
  }

  const newId = randomBytes(16).toString("hex");

  await db.insert(skills).values({
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
    action: "CREATE_SKILL",
    entityType: "skill",
    entityId: newId,
    details: { slug: val.data.slug, status: val.data.status },
    createdAt: new Date(),
  });

  revalidatePath("/admin/skills");
  revalidatePath("/id/skills");
  revalidatePath("/en/skills");
  redirect("/admin/skills");
}

export async function updateSkillAction(id: string, prevState: unknown, formData: FormData) {
  const user = await requireAuth();

  const raw = {
    slug: formData.get("slug") as string,
    titleId: formData.get("titleId") as string,
    titleEn: formData.get("titleEn") as string,
    summaryId: formData.get("summaryId") as string,
    summaryEn: formData.get("summaryEn") as string,
    contentId: formData.get("contentId") as string,
    contentEn: formData.get("contentEn") as string,
    categoryId: (formData.get("categoryId") as string) || null,
    sourceType: (formData.get("sourceType") as "original" | "github") || "original",
    repoUrl: (formData.get("repoUrl") as string) || null,
    filePath: (formData.get("filePath") as string) || null,
    license: (formData.get("license") as string) || null,
    authorName: (formData.get("authorName") as string) || null,
    authorUrl: (formData.get("authorUrl") as string) || null,
    attribution: (formData.get("attribution") as string) || null,
    previewType: (formData.get("previewType") as "none" | "html" | "image" | "tokens") || "none",
    previewHtml: (formData.get("previewHtml") as string) || null,
    previewImageUrl: (formData.get("previewImageUrl") as string) || null,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = skillFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  await db
    .update(skills)
    .set({
      ...val.data,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "UPDATE_SKILL",
    entityType: "skill",
    entityId: id,
    details: { slug: val.data.slug, status: val.data.status },
    createdAt: new Date(),
  });

  revalidatePath("/admin/skills");
  revalidatePath(`/admin/skills/${id}/edit`);
  revalidatePath(`/id/skills/${val.data.slug}`);
  revalidatePath(`/en/skills/${val.data.slug}`);

  return { success: true };
}

export async function deleteSkillAction(id: string) {
  const user = await requireAuth();

  await db.delete(skills).where(eq(skills.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "DELETE_SKILL",
    entityType: "skill",
    entityId: id,
    createdAt: new Date(),
  });

  revalidatePath("/admin/skills");
  revalidatePath("/id/skills");
  revalidatePath("/en/skills");
}
