"use server";

import { z } from "zod";
import { db } from "@/db";
import { prompts, auditLog } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { translateIdToEn } from "@/lib/ai";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const submitPromptSchema = z.object({
  titleId: z.string().min(3, "Judul Indonesia minimal 3 karakter").max(120),
  titleEn: z.string().min(3, "Judul Inggris minimal 3 karakter").max(120),
  descriptionId: z.string().min(10, "Deskripsi minimal 10 karakter").max(300),
  descriptionEn: z.string().min(10, "Deskripsi minimal 10 karakter").max(300),
  contentId: z.string().min(20, "Templat prompt minimal 20 karakter"),
  contentEn: z.string().min(20, "Templat prompt minimal 20 karakter"),
  slug: z.string().min(2).max(100),
  categoryId: z.string().nullable().optional(),
  variables: z.array(z.string()).default([]),
});

export async function submitPromptAction(prevState: unknown, formData: FormData) {
  try {
    const rawTitle = ((formData.get("title") || formData.get("titleId")) as string || "").trim();
    let titleId = ((formData.get("titleId") || rawTitle) as string || "").trim();
    let titleEn = ((formData.get("titleEn") || rawTitle) as string || "").trim();

    const rawDesc = ((formData.get("description") || formData.get("descriptionId")) as string || "").trim();
    let descriptionId = ((formData.get("descriptionId") || rawDesc) as string || "").trim();
    let descriptionEn = ((formData.get("descriptionEn") || rawDesc) as string || "").trim();

    const rawContent = ((formData.get("content") || formData.get("contentId")) as string || "").trim();
    let contentId = ((formData.get("contentId") || rawContent) as string || "").trim();
    let contentEn = ((formData.get("contentEn") || rawContent) as string || "").trim();

    let slug = ((formData.get("slug") as string) || "").trim();
    const categoryId = (formData.get("categoryId") as string) || null;

    if (!titleEn && titleId) {
      titleEn = titleId;
    }
    if (!descriptionEn && descriptionId) {
      descriptionEn = descriptionId;
    }
    if (!contentEn && contentId) {
      contentEn = contentId;
    }

    let variables: string[] = [];
    const rawVars = formData.get("variables");
    if (typeof rawVars === "string") {
      variables = rawVars.split(",").map((v) => v.trim()).filter(Boolean);
    }

    if (!slug) {
      slug = (titleEn || titleId)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const parsed = submitPromptSchema.safeParse({
      titleId,
      titleEn,
      descriptionId,
      descriptionEn,
      contentId,
      contentEn,
      slug,
      categoryId,
      variables,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || "Input tidak valid",
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        error: "Anda harus masuk untuk mengirim prompt.",
      };
    }

    const existing = await db
      .select({ id: prompts.id })
      .from(prompts)
      .where(eq(prompts.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    const isAdmin = currentUser.role === "admin" || currentUser.role === "editor";
    const status = isAdmin ? "published" : "pending";
    const promptId = `prm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(prompts).values({
      id: promptId,
      slug,
      titleId: parsed.data.titleId,
      titleEn: parsed.data.titleEn,
      descriptionId: parsed.data.descriptionId,
      descriptionEn: parsed.data.descriptionEn,
      contentId: parsed.data.contentId,
      contentEn: parsed.data.contentEn,
      categoryId: parsed.data.categoryId || null,
      variables: parsed.data.variables,
      copyCount: 0,
      status,
      createdBy: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await db.insert(auditLog).values({
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        userId: currentUser.id,
        userEmail: currentUser.email,
        action: "submit_prompt",
        entityType: "prompt",
        entityId: promptId,
        details: { slug, titleId: parsed.data.titleId, status },
        createdAt: new Date(),
      });
    } catch {}

    revalidatePath("/[locale]/prompts", "page");
    revalidatePath("/admin/prompts", "page");

    return {
      success: true,
      status,
      slug,
      id: promptId,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal mengirim prompt. Silakan coba lagi.",
    };
  }
}
