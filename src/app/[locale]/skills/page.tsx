import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkills, getAllCategories } from "@/db/queries";
import { SkillCard } from "@/components/skill-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "Agent Skills Catalogue" : "Katalog Skill AI Agent";
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
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { q, category, sort } = await searchParams;

  setRequestLocale(locale);
  const t = await getTranslations("skills");

  const [allCategories, result] = await Promise.all([
    getAllCategories("all"),
    getPublishedSkills({ q, categorySlug: category, sort }),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      <CatalogToolbar
        categories={allCategories}
        locale={locale}
        totalCount={result.length}
      />

      {result.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
          {locale === "en"
            ? "No published skills matched your filters."
            : "Tidak ada skill terbit yang cocok dengan kriteria filter Anda."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {result.map(({ skill, category }) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
