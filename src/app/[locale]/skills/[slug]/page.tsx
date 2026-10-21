import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkillBySlug, getRelatedSkills } from "@/db/queries";
import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { CopySkillButton } from "@/components/copy-skill-button";
import { DownloadSkillButton } from "@/components/download-skill-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SkillPreviewViewer } from "@/components/skill-preview-viewer";
import { SkillCard } from "@/components/skill-card";
import { SkillDetailTabs } from "@/components/skill-detail-tabs";

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const item = await getPublishedSkillBySlug(slug);
  if (!item) {
    return { title: "Skill Not Found" };
  }

  const { skill } = item;
  const title = isEn ? skill.titleEn : skill.titleId;
  const description = isEn ? skill.summaryEn : skill.summaryId;

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/skills/${slug}`,
      languages: {
        id: `https://proskillai.dev/id/skills/${slug}`,
        en: `https://proskillai.dev/en/skills/${slug}`,
        "x-default": `https://proskillai.dev/id/skills/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/skills/${slug}`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "article",
    },
  };
}

export default async function SkillDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("skills");

  const item = await getPublishedSkillBySlug(slug);
  if (!item) {
    notFound();
  }

  const { skill, category } = item;
  const isEn = locale === "en";
  const title = isEn ? skill.titleEn : skill.titleId;
  const summary = isEn ? skill.summaryEn : skill.summaryId;
  const content = isEn ? skill.contentEn : skill.contentId;
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;

  const related = skill.categoryId
    ? await getRelatedSkills(skill.categoryId, skill.id, 3)
    : [];

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
        name: "Skills",
        item: `https://proskillai.dev/${locale}/skills`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `https://proskillai.dev/${locale}/skills/${slug}`,
      },
    ],
  };

  const hasPreview = skill.previewType !== "none" && Boolean(skill.previewHtml || skill.previewImageUrl || skill.designTokens);

  const previewNode = (
    <section aria-labelledby="preview-heading" className="space-y-3">
      <h2 id="preview-heading" className="sr-only">
        {t("tabPreview")}
      </h2>
      <SkillPreviewViewer skill={skill} locale={locale} />
    </section>
  );

  const contentNode = (
    <section aria-labelledby="content-heading" className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h2 id="content-heading" className="text-sm font-semibold text-foreground tracking-tight">
          {t("tabContent")}
        </h2>
        <span className="font-mono text-xs text-neutral-400">SKILL.md</span>
      </div>

      <div className="p-4 sm:p-6 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface">
        <MarkdownRenderer content={content} />
      </div>
    </section>
  );

  return (
    <article className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="space-y-4">
        <Link
          href={`/${locale}/skills`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to Skills" : "Kembali ke Katalog Skills"}</span>
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
            {summary}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 pt-2">
          <CopySkillButton
            skillId={skill.id}
            content={content}
            label={t("copyRaw")}
            copiedLabel={t("copied")}
          />
          <DownloadSkillButton
            skillId={skill.id}
            content={content}
            filename={`${skill.slug}.md`}
            label={t("download")}
          />
          {(skill.copyCount > 0 || skill.downloadCount > 0) && (
            <span className="text-xs font-mono text-neutral-500 pl-2">
              {skill.copyCount > 0 && `${skill.copyCount} ${isEn ? "copies" : "salinan"}`}
              {skill.copyCount > 0 && skill.downloadCount > 0 && " • "}
              {skill.downloadCount > 0 && `${skill.downloadCount} ${isEn ? "downloads" : "unduhan"}`}
            </span>
          )}
        </div>
      </div>

      <SkillDetailTabs
        hasPreview={hasPreview}
        previewNode={previewNode}
        contentNode={contentNode}
        locale={locale}
      />

      <section aria-labelledby="install-heading" className="p-4 sm:p-5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-3 text-xs">
        <h2 id="install-heading" className="font-semibold text-foreground tracking-tight">
          {t("installGuide")}
        </h2>
        <ol className="list-decimal pl-4 space-y-1.5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <li>{t("installStep1")}</li>
          <li>{t("installStep2")}</li>
          <li>{t("installStep3")}</li>
        </ol>
      </section>

      <section aria-labelledby="provenance-heading" className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-3 text-xs">
        <h2 id="provenance-heading" className="font-semibold text-foreground tracking-tight">
          {t("provenance")}
        </h2>

        {skill.sourceType === "github" ? (
          <div className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{t("sourceRepo")}:</span>
              {skill.repoUrl ? (
                <a
                  href={skill.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-foreground hover:underline inline-flex items-center gap-1"
                >
                  <span>{skill.repoUrl.replace("https://github.com/", "")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span>-</span>
              )}
            </div>

            {skill.filePath && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">{t("filePath")}:</span>
                <span className="font-mono">{skill.filePath}</span>
              </div>
            )}

            {skill.commitHash && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">{t("commit")}:</span>
                <span className="font-mono">{skill.commitHash.slice(0, 7)}</span>
              </div>
            )}

            {skill.license && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">{t("license")}:</span>
                <span className="font-semibold text-foreground">{skill.license}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5 text-foreground font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("originalWork")}</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {t("originalDesc")}
            </p>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h2 id="related-heading" className="text-sm font-semibold text-foreground tracking-tight">
            {t("relatedSkills")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {related.map(({ skill: rSkill, category: rCategory }) => (
              <SkillCard
                key={rSkill.id}
                skill={rSkill}
                category={rCategory}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
