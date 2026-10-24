"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { uiInspirations, auditLog } from "@/db/schema";
import { requireAdminOrEditor } from "@/lib/auth";
import { and, eq, ne } from "drizzle-orm";

const designTrendSchema = z.object({
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  titleId: z.string().min(2, "Judul Indonesia wajib diisi"),
  titleEn: z.string().min(2, "Judul Inggris wajib diisi"),
  descriptionId: z.string().min(5, "Deskripsi Indonesia minimal 5 karakter"),
  descriptionEn: z.string().min(5, "Deskripsi Inggris minimal 5 karakter"),
  category: z.enum(["cards", "agentic", "nav", "forms", "metrics", "modals"]).default("cards"),
  componentSnippet: z.string().min(10, "Kode komponen snippet minimal 10 karakter"),
  tailwindClasses: z.string().optional().nullable(),
  uxGuidelinesId: z.string().optional().nullable(),
  uxGuidelinesEn: z.string().optional().nullable(),
  previewType: z.string().default("component"),
  previewImageUrl: z.string().optional().nullable(),
  status: z.enum(["published", "draft", "archived"]).default("published"),
});

export async function createDesignTrendAction(prevState: unknown, formData: FormData) {
  const user = await requireAdminOrEditor();

  const rawTags = (formData.get("tags") as string) || "";
  const tags = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let designTokens: Record<string, string> = {
    radius: "8px",
    density: "Compact Non-Pill",
    contrast: "WCAG 2.2 AA",
  };
  const rawTokens = (formData.get("designTokensJson") as string) || "";
  if (rawTokens.trim()) {
    try {
      designTokens = JSON.parse(rawTokens);
    } catch {}
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    titleId: (formData.get("titleId") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim(),
    descriptionId: (formData.get("descriptionId") as string)?.trim(),
    descriptionEn: (formData.get("descriptionEn") as string)?.trim(),
    category: (formData.get("category") as "cards" | "agentic" | "nav" | "forms" | "metrics" | "modals") || "cards",
    componentSnippet: (formData.get("componentSnippet") as string)?.trim(),
    tailwindClasses: (formData.get("tailwindClasses") as string)?.trim() || null,
    uxGuidelinesId: (formData.get("uxGuidelinesId") as string)?.trim() || null,
    uxGuidelinesEn: (formData.get("uxGuidelinesEn") as string)?.trim() || null,
    previewType: (formData.get("previewType") as string) || "component",
    previewImageUrl: (formData.get("previewImageUrl") as string)?.trim() || null,
    status: (formData.get("status") as "published" | "draft" | "archived") || "published",
  };

  const val = designTrendSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const existing = await db
    .select({ id: uiInspirations.id })
    .from(uiInspirations)
    .where(eq(uiInspirations.slug, val.data.slug))
    .limit(1);

  if (existing.length > 0) {
    return { error: "Slug sudah digunakan, gunakan slug unik lain." };
  }

  const newId = `ui_${randomBytes(12).toString("hex")}`;

  await db.insert(uiInspirations).values({
    id: newId,
    ...val.data,
    tags,
    designTokens,
    likesCount: 0,
    copyCount: 0,
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "CREATE_DESIGN_TREND",
    entityType: "ui_inspiration",
    entityId: newId,
    details: { slug: val.data.slug, title: val.data.titleEn },
    createdAt: new Date(),
  });

  revalidatePath("/admin/design-trends");
  revalidatePath("/id/ui");
  revalidatePath("/en/ui");
  redirect("/admin/design-trends");
}

export async function updateDesignTrendAction(id: string, prevState: unknown, formData: FormData) {
  const user = await requireAdminOrEditor();

  const rawTags = (formData.get("tags") as string) || "";
  const tags = rawTags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  let designTokens: Record<string, string> = {
    radius: "8px",
    density: "Compact Non-Pill",
    contrast: "WCAG 2.2 AA",
  };
  const rawTokens = (formData.get("designTokensJson") as string) || "";
  if (rawTokens.trim()) {
    try {
      designTokens = JSON.parse(rawTokens);
    } catch {}
  }

  const raw = {
    slug: (formData.get("slug") as string)?.trim().toLowerCase(),
    titleId: (formData.get("titleId") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim(),
    descriptionId: (formData.get("descriptionId") as string)?.trim(),
    descriptionEn: (formData.get("descriptionEn") as string)?.trim(),
    category: (formData.get("category") as "cards" | "agentic" | "nav" | "forms" | "metrics" | "modals") || "cards",
    componentSnippet: (formData.get("componentSnippet") as string)?.trim(),
    tailwindClasses: (formData.get("tailwindClasses") as string)?.trim() || null,
    uxGuidelinesId: (formData.get("uxGuidelinesId") as string)?.trim() || null,
    uxGuidelinesEn: (formData.get("uxGuidelinesEn") as string)?.trim() || null,
    previewType: (formData.get("previewType") as string) || "component",
    previewImageUrl: (formData.get("previewImageUrl") as string)?.trim() || null,
    status: (formData.get("status") as "published" | "draft" | "archived") || "published",
  };

  const val = designTrendSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const duplicate = await db
    .select({ id: uiInspirations.id })
    .from(uiInspirations)
    .where(and(eq(uiInspirations.slug, val.data.slug), ne(uiInspirations.id, id)))
    .limit(1);

  if (duplicate.length > 0) {
    return { error: "Slug sudah digunakan oleh pola lain." };
  }

  await db
    .update(uiInspirations)
    .set({
      ...val.data,
      tags,
      designTokens,
      updatedAt: new Date(),
    })
    .where(eq(uiInspirations.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "UPDATE_DESIGN_TREND",
    entityType: "ui_inspiration",
    entityId: id,
    details: { slug: val.data.slug },
    createdAt: new Date(),
  });

  revalidatePath("/admin/design-trends");
  revalidatePath(`/admin/design-trends/${id}/edit`);
  revalidatePath(`/id/ui/${val.data.slug}`);
  revalidatePath(`/en/ui/${val.data.slug}`);
  revalidatePath("/id/ui");
  revalidatePath("/en/ui");

  return { success: true };
}

export async function deleteDesignTrendAction(id: string) {
  const user = await requireAdminOrEditor();

  await db.delete(uiInspirations).where(eq(uiInspirations.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "DELETE_DESIGN_TREND",
    entityType: "ui_inspiration",
    entityId: id,
    createdAt: new Date(),
  });

  revalidatePath("/admin/design-trends");
  revalidatePath("/id/ui");
  revalidatePath("/en/ui");
  return { success: true };
}

export async function toggleDesignTrendStatusAction(id: string, newStatus: "published" | "draft" | "archived") {
  const user = await requireAdminOrEditor();

  await db
    .update(uiInspirations)
    .set({
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(uiInspirations.id, id));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "CHANGE_STATUS_DESIGN_TREND",
    entityType: "ui_inspiration",
    entityId: id,
    details: { newStatus },
    createdAt: new Date(),
  });

  revalidatePath("/admin/design-trends");
  revalidatePath("/id/ui");
  revalidatePath("/en/ui");
  return { success: true };
}
