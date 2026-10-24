import type { MetadataRoute } from "next";
import { getSitemapData, getAllUiInspirations } from "@/db/queries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ publishedSkills, publishedPrompts }, publishedInspirations] = await Promise.all([
    getSitemapData(),
    getAllUiInspirations(),
  ]);

  const staticRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/trending", priority: 0.95, freq: "daily" as const },
    { path: "/mcp", priority: 0.95, freq: "daily" as const },
    { path: "/ui", priority: 0.95, freq: "daily" as const },
    { path: "/skills", priority: 0.9, freq: "daily" as const },
    { path: "/prompts", priority: 0.85, freq: "daily" as const },
    { path: "/privacy", priority: 0.3, freq: "monthly" as const },
    { path: "/terms", priority: 0.3, freq: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const item of staticRoutes) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${BASE_URL}/${locale}${item.path}`,
        lastModified: new Date(),
        changeFrequency: item.freq,
        priority: item.priority,
        alternates: {
          languages: {
            id: `${BASE_URL}/id${item.path}`,
            en: `${BASE_URL}/en${item.path}`,
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

  for (const ins of publishedInspirations) {
    for (const locale of ["id", "en"]) {
      entries.push({
        url: `${BASE_URL}/${locale}/ui/${ins.slug}`,
        lastModified: ins.updatedAt,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            id: `${BASE_URL}/id/ui/${ins.slug}`,
            en: `${BASE_URL}/en/ui/${ins.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
