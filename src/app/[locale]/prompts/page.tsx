import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedPrompts, getAllCategories } from "@/db/queries";
import { PromptCard } from "@/components/prompt-card";
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

  const title = isEn ? "AI Prompt Library" : "Kumpulan Prompt Rekayasa AI";
  const description = isEn
    ? "Verified software engineering, architecture, and anti-slop prompts with interactive variable substitution."
    : "Koleksi prompt rekayasa perangkat lunak, arsitektur, dan UI anti-slop dengan dukungan variabel dinamis siap pakai.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/prompts`,
      languages: {
        id: "https://proskillai.dev/id/prompts",
        en: "https://proskillai.dev/en/prompts",
        "x-default": "https://proskillai.dev/id/prompts",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/prompts`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function PromptsCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { q, category, sort } = await searchParams;

  setRequestLocale(locale);
  const t = await getTranslations("prompts");

  const [allCategories, result] = await Promise.all([
    getAllCategories("all"),
    getPublishedPrompts({ q, categorySlug: category, sort }),
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
          {t("emptyState")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {result.map(({ prompt, category }) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
