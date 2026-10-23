import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedPrompts, getAllCategories } from "@/db/queries";
import { OnePageCatalog } from "@/components/one-page-catalog";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "AI Prompt Library | ProSkillAI" : "Kumpulan Prompt Rekayasa AI | ProSkillAI";
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
}: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prompts");

  const [allCategories, allPrompts] = await Promise.all([
    getAllCategories("all"),
    getPublishedPrompts({}),
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
        skills={[]}
        prompts={allPrompts}
        categories={allCategories}
        locale={locale}
      />
    </div>
  );
}
