"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { skills, auditLog } from "@/db/schema";
import { requireAdminOrEditor } from "@/lib/auth";
import { translateIdToEn } from "@/lib/ai";
import { and, eq, ne } from "drizzle-orm";

const imageUrlSchema = z.string().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}, "URL gambar tidak valid");

function parseStringArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];
  } catch {
    return [];
  }
}

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
  branch: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  authorName: z.string().nullable().optional(),
  authorUrl: z.string().nullable().optional(),
  attribution: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(imageUrlSchema).max(5, "Maksimal 5 gambar").optional(),
  previewType: z.enum(["none", "html", "image", "video", "markdown", "tokens"]).default("none"),
  previewHtml: z.string().nullable().optional(),
  previewImageUrl: z.string().nullable().optional(),
  previewVideoUrl: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function createSkillAction(prevState: unknown, formData: FormData) {
  const user = await requireAdminOrEditor();

  const images = parseStringArray(formData.get("imagesJson")).slice(0, 5);
  const tags = parseStringArray(formData.get("tagsJson"));

  let files: any[] = [];
  const rawFiles = formData.get("filesJson") as string;
  if (rawFiles) {
    try {
      const parsed = JSON.parse(rawFiles);
      if (Array.isArray(parsed)) {
        files = parsed.slice(0, 10).map((f: any) => ({
          id: String(f.id || `file_${Date.now()}`),
          name: String(f.name || "file.txt").slice(0, 100),
          content: String(f.content || ""),
          language: typeof f.language === "string" ? f.language : undefined,
          size: typeof f.size === "number" ? f.size : (f.content?.length || 0),
        }));
      }
    } catch {
      files = [];
    }
  }

  const titleId = ((formData.get("titleId") as string) || "").trim();
  let titleEn = ((formData.get("titleEn") as string) || "").trim();
  const summaryId = ((formData.get("summaryId") as string) || "").trim();
  let summaryEn = ((formData.get("summaryEn") as string) || "").trim();
  const contentId = ((formData.get("contentId") as string) || "").trim();
  let contentEn = ((formData.get("contentEn") as string) || "").trim();

  if (!titleEn && titleId) {
    titleEn = await translateIdToEn({ text: titleId, type: "title" }).catch(() => titleId);
  }
  if (!summaryEn && summaryId) {
    summaryEn = await translateIdToEn({ text: summaryId, type: "description" }).catch(() => summaryId);
  }
  if (!contentEn && contentId) {
    contentEn = await translateIdToEn({ text: contentId, type: "content" }).catch(() => contentId);
  }

  const raw = {
    slug: formData.get("slug") as string,
    titleId,
    titleEn,
    summaryId,
    summaryEn,
    contentId,
    contentEn,
    categoryId: (formData.get("categoryId") as string) || null,
    sourceType: (formData.get("sourceType") as "original" | "github") || "original",
    repoUrl: (formData.get("repoUrl") as string) || null,
    filePath: (formData.get("filePath") as string) || null,
    branch: (formData.get("branch") as string) || null,
    license: (formData.get("license") as string) || null,
    authorName: (formData.get("authorName") as string) || null,
    authorUrl: (formData.get("authorUrl") as string) || null,
    attribution: (formData.get("attribution") as string) || null,
    tags,
    images,
    previewType: (formData.get("previewType") as "none" | "html" | "image" | "video" | "markdown" | "tokens") || "none",
    previewHtml: (formData.get("previewHtml") as string) || null,
    previewImageUrl: (formData.get("previewImageUrl") as string) || null,
    previewVideoUrl: (formData.get("previewVideoUrl") as string) || null,
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
    images: val.data.images ?? [],
    tags: val.data.tags ?? [],
    files,
    previewImageUrl: val.data.images?.[0] ?? val.data.previewImageUrl ?? null,
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
  const user = await requireAdminOrEditor();

  const images = parseStringArray(formData.get("imagesJson")).slice(0, 5);
  const tags = parseStringArray(formData.get("tagsJson"));

  let files: any[] = [];
  const rawFiles = formData.get("filesJson") as string;
  if (rawFiles) {
    try {
      const parsed = JSON.parse(rawFiles);
      if (Array.isArray(parsed)) {
        files = parsed.slice(0, 10).map((f: any) => ({
          id: String(f.id || `file_${Date.now()}`),
          name: String(f.name || "file.txt").slice(0, 100),
          content: String(f.content || ""),
          language: typeof f.language === "string" ? f.language : undefined,
          size: typeof f.size === "number" ? f.size : (f.content?.length || 0),
        }));
      }
    } catch {
      files = [];
    }
  }

  const titleId = ((formData.get("titleId") as string) || "").trim();
  let titleEn = ((formData.get("titleEn") as string) || "").trim();
  const summaryId = ((formData.get("summaryId") as string) || "").trim();
  let summaryEn = ((formData.get("summaryEn") as string) || "").trim();
  const contentId = ((formData.get("contentId") as string) || "").trim();
  let contentEn = ((formData.get("contentEn") as string) || "").trim();

  if (!titleEn && titleId) {
    titleEn = await translateIdToEn({ text: titleId, type: "title" }).catch(() => titleId);
  }
  if (!summaryEn && summaryId) {
    summaryEn = await translateIdToEn({ text: summaryId, type: "description" }).catch(() => summaryId);
  }
  if (!contentEn && contentId) {
    contentEn = await translateIdToEn({ text: contentId, type: "content" }).catch(() => contentId);
  }

  const raw = {
    slug: formData.get("slug") as string,
    titleId,
    titleEn,
    summaryId,
    summaryEn,
    contentId,
    contentEn,
    categoryId: (formData.get("categoryId") as string) || null,
    sourceType: (formData.get("sourceType") as "original" | "github") || "original",
    repoUrl: (formData.get("repoUrl") as string) || null,
    filePath: (formData.get("filePath") as string) || null,
    branch: (formData.get("branch") as string) || null,
    license: (formData.get("license") as string) || null,
    authorName: (formData.get("authorName") as string) || null,
    authorUrl: (formData.get("authorUrl") as string) || null,
    attribution: (formData.get("attribution") as string) || null,
    tags,
    images,
    previewType: (formData.get("previewType") as "none" | "html" | "image" | "video" | "markdown" | "tokens") || "none",
    previewHtml: (formData.get("previewHtml") as string) || null,
    previewImageUrl: (formData.get("previewImageUrl") as string) || null,
    previewVideoUrl: (formData.get("previewVideoUrl") as string) || null,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = skillFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const duplicate = await db
    .select({ id: skills.id })
    .from(skills)
    .where(and(eq(skills.slug, val.data.slug), ne(skills.id, id)))
    .limit(1);
  if (duplicate.length > 0) {
    return { error: "Slug sudah digunakan, harap gunakan slug lain." };
  }

  await db
    .update(skills)
    .set({
      ...val.data,
      images: val.data.images ?? [],
      tags: val.data.tags ?? [],
      files,
      previewImageUrl: val.data.images?.[0] ?? val.data.previewImageUrl ?? null,
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
  const user = await requireAdminOrEditor();

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

export async function approveSkillAction(id: string) {
  const user = await requireAdminOrEditor();

  await db
    .update(skills)
    .set({ status: "published", updatedAt: new Date() })
    .where(eq(skills.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "APPROVE_SKILL",
    entityType: "skill",
    entityId: id,
    createdAt: new Date(),
  });

  revalidatePath("/admin/skills");
  revalidatePath("/id/skills");
  revalidatePath("/en/skills");
  return { success: true };
}
