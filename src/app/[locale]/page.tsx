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

  const title = isEn
    ? "ProSkillAI | Curated Directory of AI Agent Skills"
    : "ProSkillAI | Direktori Terkurasi Skill AI Agent";
  const description = isEn
    ? "Discover the best AI agent skills for Claude Code, Cursor, and Codex. Verified S-rank art direction, system architecture, and 1-click CLI commands."
    : "Temukan koleksi skill AI agent terbaik untuk Claude Code, Cursor, dan Codex. Standar S-rank, arsitektur sistem, dan instalasi 1-klik.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}`,
      languages: {
        id: "https://proskillai.dev/id",
        en: "https://proskillai.dev/en",
        "x-default": "https://proskillai.dev/id",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}`,
      siteName: "ProSkillAI",
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
