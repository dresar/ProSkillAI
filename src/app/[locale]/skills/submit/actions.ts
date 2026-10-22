"use server";

import { z } from "zod";
import { db } from "@/db";
import { skills, auditLog } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { parseGitHubUrl, parseSkillCandidate, fetchFileContent } from "@/lib/github";
import matter from "gray-matter";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function parseRawSkillAction(rawMarkdown: string) {
  try {
    const trimmed = rawMarkdown.trim();
    if (!trimmed) {
      return { error: "Konten markdown tidak boleh kosong" };
    }

    const { data: frontmatter, content } = matter(trimmed);

    const name =
      (frontmatter.name as string) ||
      (frontmatter.title as string) ||
      "";

    const description =
      (frontmatter.description as string) ||
      (frontmatter.summary as string) ||
      "";

    let tags: string[] = [];
    if (Array.isArray(frontmatter.tags)) {
      tags = frontmatter.tags.map(String);
    } else if (Array.isArray(frontmatter.keywords)) {
      tags = frontmatter.keywords.map(String);
    } else if (typeof frontmatter.tags === "string") {
      tags = frontmatter.tags.split(",").map((s) => s.trim()).filter(Boolean);
    }

    const license = (frontmatter.license as string) || "MIT";
    const author = (frontmatter.author as string) || "";

    const slug = name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      : "";

    return {
      success: true,
      data: {
        title: name,
        summary: description,
        content: content.trim() || trimmed,
        tags,
        license,
        author,
        slug,
      },
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengekstrak frontmatter SKILL.md",
    };
  }
}

export async function fetchGitHubSkillAction(githubUrl: string) {
  try {
    const parsed = parseGitHubUrl(githubUrl);
    let filePath = parsed.pathFilter || "SKILL.md";
    if (!filePath.endsWith(".md")) {
      filePath = `${filePath.replace(/\/$/, "")}/SKILL.md`;
    }

    const branch = parsed.branch || "main";
    let rawContent = "";

    try {
      rawContent = await fetchFileContent(parsed.owner, parsed.repo, filePath, branch);
    } catch {
      rawContent = await fetchFileContent(parsed.owner, parsed.repo, "README.md", branch);
      filePath = "README.md";
    }

    const candidate = parseSkillCandidate(
      filePath,
      "head",
      rawContent,
      null,
      parsed.repo
    );

    const slug = candidate.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      success: true,
      data: {
        title: candidate.name,
        summary: candidate.description,
        content: candidate.rawContent,
        license: candidate.licenseSpdx || "MIT",
        author: parsed.owner,
        authorUrl: `https://github.com/${parsed.owner}`,
        repoUrl: `https://github.com/${parsed.owner}/${parsed.repo}`,
        filePath,
        branch,
        slug,
      },
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Gagal mengambil data dari GitHub",
    };
  }
}

const submitSkillSchema = z.object({
  titleId: z.string().min(2, "Judul Indonesia minimal 2 karakter"),
  titleEn: z.string().min(2, "Judul Inggris minimal 2 karakter"),
  summaryId: z.string().min(5, "Ringkasan Indonesia minimal 5 karakter"),
  summaryEn: z.string().min(5, "Ringkasan Inggris minimal 5 karakter"),
  contentId: z.string().min(10, "Konten Indonesia minimal 10 karakter"),
  contentEn: z.string().min(10, "Konten Inggris minimal 10 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  license: z.string().optional().nullable(),
  authorName: z.string().optional().nullable(),
  authorUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  sourceType: z.enum(["original", "github"]).default("original"),
});

export async function submitUserSkillAction(
  _prevState: unknown,
  formData: FormData
) {
  const titleId = (formData.get("titleId") as string) || "";
  const titleEn = (formData.get("titleEn") as string) || titleId;
  const summaryId = (formData.get("summaryId") as string) || "";
  const summaryEn = (formData.get("summaryEn") as string) || summaryId;
  const contentId = (formData.get("contentId") as string) || "";
  const contentEn = (formData.get("contentEn") as string) || contentId;
  let slug = (formData.get("slug") as string) || "";
  const categoryId = (formData.get("categoryId") as string) || null;
  const license = (formData.get("license") as string) || "MIT";
  const authorName = (formData.get("authorName") as string) || "";
  const authorUrl = (formData.get("authorUrl") as string) || "";
  const repoUrl = (formData.get("repoUrl") as string) || "";
  const sourceType = (formData.get("sourceType") as "original" | "github") || "original";

  let tags: string[] = [];
  const rawTags = formData.get("tags");
  if (typeof rawTags === "string") {
    tags = rawTags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  if (!slug) {
    slug = titleId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const parsed = submitSkillSchema.safeParse({
    titleId,
    titleEn,
    summaryId,
    summaryEn,
    contentId,
    contentEn,
    slug,
    categoryId,
    tags,
    license,
    authorName,
    authorUrl,
    repoUrl,
    sourceType,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Input tidak valid",
    };
  }

  const existing = await db
    .select({ id: skills.id })
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "editor";
  const status = isAdmin ? "published" : "pending";
  const skillId = `skl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  await db.insert(skills).values({
    id: skillId,
    slug,
    titleId: parsed.data.titleId,
    titleEn: parsed.data.titleEn,
    summaryId: parsed.data.summaryId,
    summaryEn: parsed.data.summaryEn,
    contentId: parsed.data.contentId,
    contentEn: parsed.data.contentEn,
    categoryId: parsed.data.categoryId || null,
    sourceType: parsed.data.sourceType,
    repoUrl: parsed.data.repoUrl || null,
    license: parsed.data.license || "MIT",
    authorName: parsed.data.authorName || currentUser?.name || "Kontributor Komunitas",
    authorUrl: parsed.data.authorUrl || null,
    tags: parsed.data.tags || [],
    status,
    previewType: "none",
    createdBy: currentUser?.id || null,
  });

  if (currentUser) {
    await db.insert(auditLog).values({
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      action: "skill_submitted",
      entityType: "skill",
      entityId: skillId,
      details: { slug, status, title: parsed.data.titleId },
    });
  }

  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  revalidatePath("/id/skills");
  revalidatePath("/en/skills");

  return {
    success: true,
    slug,
    status,
  };
}
