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

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const title = isEn ? "AI Prompt Library | Skills (skills.biz.id)" : "Kumpulan Prompt Rekayasa AI | Skills (skills.biz.id)";
  const description = isEn
    ? "Verified software engineering, architecture, and anti-slop prompts with interactive variable substitution."
    : "Koleksi prompt rekayasa perangkat lunak, arsitektur, dan UI anti-slop dengan dukungan variabel dinamis siap pakai.";

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/prompts`,
      languages: {
        id: `${baseUrl}/id/prompts`,
        en: `${baseUrl}/en/prompts`,
        "x-default": `${baseUrl}/id/prompts`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/prompts`,
      siteName: "Skills",
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
