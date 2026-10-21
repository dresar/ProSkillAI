import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedPromptBySlug } from "@/db/queries";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PromptVariableEngine } from "@/components/prompt-variable-engine";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const item = await getPublishedPromptBySlug(slug);
  if (!item) {
    return { title: "Prompt Not Found" };
  }

  const { prompt } = item;
  const title = isEn ? prompt.titleEn : prompt.titleId;
  const description = isEn ? prompt.descriptionEn : prompt.descriptionId;

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/prompts/${slug}`,
      languages: {
        id: `https://proskillai.dev/id/prompts/${slug}`,
        en: `https://proskillai.dev/en/prompts/${slug}`,
        "x-default": `https://proskillai.dev/id/prompts/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/prompts/${slug}`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "article",
    },
  };
}

export default async function PromptDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("prompts");

  const item = await getPublishedPromptBySlug(slug);
  if (!item) {
    notFound();
  }

  const { prompt, category, skill } = item;
  const isEn = locale === "en";
  const title = isEn ? prompt.titleEn : prompt.titleId;
  const description = isEn ? prompt.descriptionEn : prompt.descriptionId;
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Beranda",
        item: `https://proskillai.dev/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Prompts",
        item: `https://proskillai.dev/${locale}/prompts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://proskillai.dev/${locale}/prompts/${slug}`,
      },
    ],
  };

  return (
    <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="space-y-4">
        <Link
          href={`/${locale}/prompts`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to Prompts" : "Kembali ke Katalog Prompts"}</span>
        </Link>

        <div className="space-y-2">
          {categoryName && (
            <div className="text-xs font-medium text-neutral-500">
              {categoryName}
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
            {description}
          </p>
          {prompt.copyCount > 0 && (
            <div className="text-xs font-mono text-neutral-500 pt-1">
              {prompt.copyCount} {isEn ? "copies recorded" : "kali disalin"}
            </div>
          )}
        </div>
      </div>

      {skill && (
        <div className="p-3.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-500 mr-2">{t("relatedSkill")}:</span>
            <span className="font-semibold text-foreground">
              {isEn ? skill.titleEn : skill.titleId}
            </span>
          </div>
          <Link
            href={`/${locale}/skills/${skill.slug}`}
            className="inline-flex items-center gap-1 text-foreground font-medium hover:underline"
          >
            <span>{isEn ? "View Skill" : "Lihat Skill"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      <section aria-labelledby="interactive-engine">
        <PromptVariableEngine prompt={prompt} locale={locale} />
      </section>
    </article>
  );
}
