import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedPromptBySlug } from "@/db/queries";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { PromptVariableEngine } from "@/components/prompt-variable-engine";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const SITE_URL = "https://proskillai.dev";

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
      canonical: `${SITE_URL}/${locale}/prompts/${slug}`,
      languages: {
        id: `${SITE_URL}/id/prompts/${slug}`,
        en: `${SITE_URL}/en/prompts/${slug}`,
        "x-default": `${SITE_URL}/id/prompts/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/prompts/${slug}`,
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

  const canonical = `${SITE_URL}/${locale}/prompts/${slug}`;
  const dateModified = prompt.updatedAt ? new Date(prompt.updatedAt).toISOString() : undefined;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isEn ? "Home" : "Beranda",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Prompts",
        item: `${SITE_URL}/${locale}/prompts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonical,
      },
    ],
  };

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    programmingLanguage: "Markdown",
    url: canonical,
    dateModified,
    author: { "@type": "Organization", name: "ProSkillAI", url: SITE_URL },
  };

  return (
    <article className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="pb-2">
        <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <li>
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
              {isEn ? "Home" : "Beranda"}
            </Link>
          </li>
          <ChevronRight className="w-3 h-3 opacity-50" aria-hidden="true" />
          <li>
            <Link href={`/${locale}/prompts`} className="hover:text-foreground transition-colors">
              Prompts
            </Link>
          </li>
          <ChevronRight className="w-3 h-3 opacity-50" aria-hidden="true" />
          <li className="text-foreground font-medium truncate max-w-[50vw]">{title}</li>
        </ol>
      </nav>

      <div className="space-y-4">
        <div className="space-y-2">
          {categoryName && (
            <div className="text-xs font-medium text-muted-foreground">{categoryName}</div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
          {prompt.copyCount > 0 && (
            <div className="text-xs font-mono text-muted-foreground pt-1">
              {prompt.copyCount} {isEn ? "copies recorded" : "kali disalin"}
            </div>
          )}
        </div>
      </div>

      {skill && (
        <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground mr-2">{t("relatedSkill")}:</span>
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
