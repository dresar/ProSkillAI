import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedPromptBySlug } from "@/db/queries";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { PromptVariableEngine } from "@/components/prompt-variable-engine";
import { ImageGallery } from "@/components/admin/image-gallery";
import { FavoriteButton } from "@/components/favorite-button";
import { getCoverImage, getImageList, DEFAULT_PROMPT_COVER } from "@/lib/images";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const SITE_URL = "https://proskillai.dev";

function limitToThreeSentences(text: string): string {
  const matches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (matches && matches.length > 3) {
    return matches.slice(0, 3).join("").trim();
  }
  return text;
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
  const description = limitToThreeSentences(isEn ? prompt.descriptionEn : prompt.descriptionId);
  const cover = getCoverImage(prompt.images);

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
      images: cover ? [cover] : undefined,
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

  const { prompt, category, skill, author } = item;
  const isEn = locale === "en";
  const title = isEn ? prompt.titleEn : prompt.titleId;
  const rawDescription = isEn ? prompt.descriptionEn : prompt.descriptionId;
  const description = limitToThreeSentences(rawDescription);
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;
  const authorName = author?.name || "ProSkillAI Team";
  const authorInitial = authorName.slice(0, 2).toUpperCase();

  const promptImages = getImageList(prompt.images, DEFAULT_PROMPT_COVER).slice(0, 5);
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
    <article className="w-full max-w-5xl px-4 sm:px-6 py-3 sm:py-4 pb-16 sm:pb-20 space-y-3.5">
      <div className="mb-1 lg:hidden">
        <Link
          href={`/${locale}/prompts`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>{isEn ? "Back" : "Kembali"}</span>
        </Link>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />

      <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {categoryName && (
              <span className="text-[11px] font-medium text-muted-foreground px-2 py-0.5 rounded-[4px] bg-muted border border-border">
                {categoryName}
              </span>
            )}
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-muted/60 border border-border/80 text-[11px]">
              <div className="w-4 h-4 rounded-full bg-foreground text-background text-[9px] font-bold flex items-center justify-center shrink-0">
                {authorInitial}
              </div>
              <span className="font-semibold text-foreground">{authorName}</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {author?.role ? `• ${author.role}` : ""}
              </span>
            </div>
          </div>
          <FavoriteButton
            item={{
              id: prompt.id,
              type: "prompt",
              slug: prompt.slug,
              title,
              summary: description,
              category: categoryName || undefined,
              cover: promptImages[0],
            }}
            className="w-7 h-7 rounded-[6px] border border-border bg-background hover:bg-muted flex items-center justify-center transition-all cursor-pointer"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {description}
        </p>
      </div>

      {promptImages.length > 0 && (
        <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-border/60">
            <span className="font-semibold text-foreground tracking-tight">
              {isEn ? "Prompt Previews" : "Pratinjau Visual"}
            </span>
          </div>
          <ImageGallery images={promptImages} alt={title} />
        </div>
      )}

      {skill && (
        <div className="p-3 sm:p-3.5 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{t("relatedSkill")}:</span>
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