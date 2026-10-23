import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPublishedSkills, getLatestPrompts, getAllCategories } from "@/db/queries";
import { AgenticHero } from "@/components/agentic-hero";
import { OnePageCatalog } from "@/components/one-page-catalog";
import { BetaSections } from "@/components/beta-sections";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

  const title = isEn
    ? "Skills | Curated Directory of AI Agent Skills (skills.biz.id)"
    : "Skills | Direktori Terkurasi Skill AI Agent (skills.biz.id)";
  const description = isEn
    ? "Discover the best AI agent skills for Claude Code, Antigravity, Cursor, and Codex. Verified S-rank art direction, system architecture, and 1-click CLI commands."
    : "Temukan koleksi skill AI agent terbaik untuk Claude Code, Antigravity, Cursor, dan Codex. Standar S-rank, arsitektur sistem, dan instalasi 1-klik.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        id: `${baseUrl}/id`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/id`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Skills",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [publishedSkills, publishedPrompts, allCategories] = await Promise.all([
    getPublishedSkills({}),
    getLatestPrompts(24),
    getAllCategories("all"),
  ]);

  return (
    <div className="w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
      <AgenticHero
        locale={locale}
        totalSkills={publishedSkills.length}
        totalCategories={allCategories.length}
      />

      <OnePageCatalog
        skills={publishedSkills}
        prompts={publishedPrompts}
        categories={allCategories}
        locale={locale}
      />

      <BetaSections />
    </div>
  );
}
