import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkills, getAllCategories } from "@/db/queries";
import { OnePageCatalog } from "@/components/one-page-catalog";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "Agent Skills Directory | ProSkillAI" : "Katalog Skill AI Agent | ProSkillAI";
  const description = isEn
    ? "Browse verified instructions, visual designs, and design tokens for AI coding agents."
    : "Telusuri kumpulan instruksi skill, desain visual, dan token terverifikasi untuk AI coding agent.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/skills`,
      languages: {
        id: "https://proskillai.dev/id/skills",
        en: "https://proskillai.dev/en/skills",
        "x-default": "https://proskillai.dev/id/skills",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/skills`,
      siteName: "ProSkillAI",
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
  const t = await getTranslations("skills");

  const [allCategories, allSkills] = await Promise.all([
    getAllCategories("all"),
    getPublishedSkills({}),
  ]);

  return (
    <div className="w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <OnePageCatalog
        skills={allSkills}
        prompts={[]}
        categories={allCategories}
        locale={locale}
      />
    </div>
  );
}
