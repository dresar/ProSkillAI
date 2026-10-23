"use server";

import { z } from "zod";
import { db } from "@/db";
import { prompts, auditLog } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
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
    const titleId = (formData.get("titleId") as string) || "";
    const titleEn = (formData.get("titleEn") as string) || titleId;
    const descriptionId = (formData.get("descriptionId") as string) || "";
    const descriptionEn = (formData.get("descriptionEn") as string) || descriptionId;
    const contentId = (formData.get("contentId") as string) || "";
    const contentEn = (formData.get("contentEn") as string) || contentId;
    let slug = (formData.get("slug") as string) || "";
    const categoryId = (formData.get("categoryId") as string) || null;

    let variables: string[] = [];
    const rawVars = formData.get("variables");
    if (typeof rawVars === "string") {
      variables = rawVars.split(",").map((v) => v.trim()).filter(Boolean);
    }

    if (!slug) {
      slug = titleId
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
