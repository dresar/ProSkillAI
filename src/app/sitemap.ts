import type { MetadataRoute } from "next";
import { db } from "@/db";
import { skills, prompts } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://proskillai.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedSkills = await db
    .select({ slug: skills.slug, updatedAt: skills.updatedAt })
    .from(skills)
    .where(eq(skills.status, "published"));

  const publishedPrompts = await db
    .select({ slug: prompts.slug, updatedAt: prompts.updatedAt })
    .from(prompts)
    .where(eq(prompts.status, "published"));

  const staticRoutes = ["", "/skills", "/prompts", "/privacy", "/terms"];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            id: `${BASE_URL}/id${route}`,
            en: `${BASE_URL}/en${route}`,
          },
        },
      });
    }
  }

  for (const s of publishedSkills) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/skills/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            id: `${BASE_URL}/id/skills/${s.slug}`,
            en: `${BASE_URL}/en/skills/${s.slug}`,
          },
        },
      });
    }
  }

  for (const p of publishedPrompts) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/prompts/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            id: `${BASE_URL}/id/prompts/${p.slug}`,
            en: `${BASE_URL}/en/prompts/${p.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
