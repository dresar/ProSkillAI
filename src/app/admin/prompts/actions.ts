"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { prompts, auditLog } from "@/db/schema";
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
  images: z.array(imageUrlSchema).max(5, "Maksimal 5 gambar").optional(),
  demoOutput: z.string().nullable().optional(),
  demoOutputEn: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  relatedSkillId: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export async function createPromptAction(prevState: unknown, formData: FormData) {
  const user = await requireAdminOrEditor();

  let variablesData = [];
  const rawVars = formData.get("variablesJson") as string;
  if (rawVars) {
    try {
      variablesData = JSON.parse(rawVars);
    } catch {
      variablesData = [];
    }
  }

  const images = parseStringArray(formData.get("imagesJson")).slice(0, 5);
  const tags = parseStringArray(formData.get("tagsJson"));

  const titleId = ((formData.get("titleId") as string) || "").trim();
  let titleEn = ((formData.get("titleEn") as string) || "").trim();
  const descriptionId = ((formData.get("descriptionId") as string) || "").trim();
  let descriptionEn = ((formData.get("descriptionEn") as string) || "").trim();
  const contentId = ((formData.get("contentId") as string) || "").trim();
  let contentEn = ((formData.get("contentEn") as string) || "").trim();

  if (!titleEn && titleId) {
    titleEn = await translateIdToEn({ text: titleId, type: "title" }).catch(() => titleId);
  }
  if (!descriptionEn && descriptionId) {
    descriptionEn = await translateIdToEn({ text: descriptionId, type: "description" }).catch(() => descriptionId);
  }
  if (!contentEn && contentId) {
    contentEn = await translateIdToEn({ text: contentId, type: "content" }).catch(() => contentId);
  }

  const rawDemoOutput = ((formData.get("demoOutput") || formData.get("demo_output")) as string || "").trim();
  const demoOutput = rawDemoOutput.length > 0 ? rawDemoOutput : null;
  const rawDemoOutputEn = ((formData.get("demoOutputEn") || formData.get("demo_output_en")) as string || "").trim();
  const demoOutputEn = rawDemoOutputEn.length > 0 ? rawDemoOutputEn : demoOutput;

  const raw = {
    slug: formData.get("slug") as string,
    titleId,
    titleEn,
    descriptionId,
    descriptionEn,
    contentId,
    contentEn,
    categoryId: (formData.get("categoryId") as string) || null,
    variables: variablesData,
    images,
    demoOutput,
    demoOutputEn,
    tags,
    relatedSkillId: (formData.get("relatedSkillId") as string) || null,
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
    images: val.data.images ?? [],
    tags: val.data.tags ?? [],
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
  const user = await requireAdminOrEditor();

  let variablesData = [];
  const rawVars = formData.get("variablesJson") as string;
  if (rawVars) {
    try {
      variablesData = JSON.parse(rawVars);
    } catch {
      variablesData = [];
    }
  }

  const images = parseStringArray(formData.get("imagesJson")).slice(0, 5);
  const tags = parseStringArray(formData.get("tagsJson"));

  const titleId = ((formData.get("titleId") as string) || "").trim();
  let titleEn = ((formData.get("titleEn") as string) || "").trim();
  const descriptionId = ((formData.get("descriptionId") as string) || "").trim();
  let descriptionEn = ((formData.get("descriptionEn") as string) || "").trim();
  const contentId = ((formData.get("contentId") as string) || "").trim();
  let contentEn = ((formData.get("contentEn") as string) || "").trim();

  if (!titleEn && titleId) {
    titleEn = await translateIdToEn({ text: titleId, type: "title" }).catch(() => titleId);
  }
  if (!descriptionEn && descriptionId) {
    descriptionEn = await translateIdToEn({ text: descriptionId, type: "description" }).catch(() => descriptionId);
  }
  if (!contentEn && contentId) {
    contentEn = await translateIdToEn({ text: contentId, type: "content" }).catch(() => contentId);
  }

  const rawDemoOutput = ((formData.get("demoOutput") || formData.get("demo_output")) as string || "").trim();
  const demoOutput = rawDemoOutput.length > 0 ? rawDemoOutput : null;
  const rawDemoOutputEn = ((formData.get("demoOutputEn") || formData.get("demo_output_en")) as string || "").trim();
  const demoOutputEn = rawDemoOutputEn.length > 0 ? rawDemoOutputEn : demoOutput;

  const raw = {
    slug: formData.get("slug") as string,
    titleId,
    titleEn,
    descriptionId,
    descriptionEn,
    contentId,
    contentEn,
    categoryId: (formData.get("categoryId") as string) || null,
    variables: variablesData,
    images,
    demoOutput,
    demoOutputEn,
    tags,
    relatedSkillId: (formData.get("relatedSkillId") as string) || null,
    status: (formData.get("status") as "draft" | "published" | "archived") || "draft",
  };

  const val = promptFormSchema.safeParse(raw);
  if (!val.success) {
    return { error: val.error.issues[0]?.message || "Validasi gagal" };
  }

  const duplicate = await db
    .select({ id: prompts.id })
    .from(prompts)
    .where(and(eq(prompts.slug, val.data.slug), ne(prompts.id, id)))
    .limit(1);
  if (duplicate.length > 0) {
    return { error: "Slug sudah digunakan." };
  }

  await db
    .update(prompts)
    .set({
      ...val.data,
      images: val.data.images ?? [],
      tags: val.data.tags ?? [],
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
  const user = await requireAdminOrEditor();

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
