import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getPublishedSkills, getAllCategories } from "@/db/queries";
import { SkillsMarketplace } from "@/components/skills-marketplace";

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
    ? "Free AI Agent Skills for Claude, ChatGPT, and 20+ Agents | Skills"
    : "Skill Agen AI Gratis untuk Claude, ChatGPT, dan 20+ Agent | Skills";
  const description = isEn
    ? "Browse verified instructions, visual designs, and design tokens for AI coding agents."
    : "Telusuri kumpulan instruksi skill, desain visual, dan token terverifikasi untuk AI coding agent.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/skills`,
      languages: {
        id: `${baseUrl}/id/skills`,
        en: `${baseUrl}/en/skills`,
        "x-default": `${baseUrl}/id/skills`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/skills`,
      siteName: "Skills",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function SkillsCatalogPage({
  params,
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [allCategories, allSkills] = await Promise.all([
    getAllCategories("all"),
    getPublishedSkills({}),
  ]);

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8">
      <SkillsMarketplace
        skills={allSkills}
        categories={allCategories}
        locale={locale}
      />
    </div>
  );
}
