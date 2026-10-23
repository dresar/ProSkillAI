import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkillBySlug, getRelatedSkills } from "@/db/queries";
import { CheckCircle2 } from "lucide-react";
import { CopySkillDropdown } from "@/components/copy-skill-dropdown";
import { DownloadSkillButton } from "@/components/download-skill-button";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SkillPreviewViewer } from "@/components/skill-preview-viewer";
import { SkillCard } from "@/components/skill-card";
import { SkillDetailTabs } from "@/components/skill-detail-tabs";
import { SkillStatsCard } from "@/components/skill-stats-card";
import { CliInstallBox } from "@/components/cli-install-box";
import { ProviderBadge, type ProviderId } from "@/components/provider-logos";
import { ImageGallery } from "@/components/admin/image-gallery";
import { getSkillCoverImage, getImageList } from "@/lib/images";

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

  const item = await getPublishedSkillBySlug(slug);
  if (!item) {
    return { title: "Skill Not Found" };
  }

  const { skill } = item;
  const title = isEn ? skill.titleEn : skill.titleId;
  const description = isEn ? skill.summaryEn : skill.summaryId;
  const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/skills/${slug}`,
      languages: {
        id: `${SITE_URL}/id/skills/${slug}`,
        en: `${SITE_URL}/en/skills/${slug}`,
        "x-default": `${SITE_URL}/id/skills/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/skills/${slug}`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "article",
      images: cover ? [cover] : undefined,
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

  const related = skill.categoryId ? await getRelatedSkills(skill.categoryId, skill.id, 3) : [];

  const canonical = `${SITE_URL}/${locale}/skills/${slug}`;
  const dateModified = skill.updatedAt ? new Date(skill.updatedAt).toISOString() : undefined;
  const authorName = skill.authorName || "ProSkillAI";
  const authorUrl = skill.authorUrl || SITE_URL;

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
        name: "Skills",
        item: `${SITE_URL}/${locale}/skills`,
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
    description: summary,
    programmingLanguage: "Markdown",
    url: canonical,
    dateModified,
    author: { "@type": "Organization", name: authorName, url: authorUrl },
    ...(skill.repoUrl ? { codeRepository: skill.repoUrl } : {}),
  };

  const sourceCodeJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: title,
    description: summary,
    programmingLanguage: "Markdown",
    url: canonical,
    dateModified,
    author: { "@type": "Organization", name: authorName, url: authorUrl },
    ...(skill.repoUrl ? { codeRepository: skill.repoUrl } : {}),
  };

  const hasPreview =
    skill.previewType !== "none" &&
    Boolean(
      skill.previewHtml ||
        skill.previewImageUrl ||
        skill.previewVideoUrl ||
        skill.designTokens ||
        skill.previewType === "markdown"
    );

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
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 id="content-heading" className="text-sm font-semibold text-foreground tracking-tight">
          {t("tabContent")}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">SKILL.md</span>
      </div>

      <div className="p-4 sm:p-6 rounded-xl border border-border bg-surface">
        <MarkdownRenderer content={content} />
      </div>
    </section>
  );

  const rawNode = (
    <section aria-labelledby="raw-heading" className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 id="raw-heading" className="text-sm font-semibold text-foreground tracking-tight">
          {isEn ? "Raw Markdown" : "Markdown Mentah"}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">.md</span>
      </div>
      <pre className="p-4 sm:p-6 rounded-xl border border-border bg-surface overflow-x-auto text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words">
        {content}
      </pre>
    </section>
  );

  const compatibleProviders: ProviderId[] = ["cmdc", "anthropic", "openai", "gemini", "cursor", "deepseek"];

  return (
    <article className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sourceCodeJsonLd) }}
      />

      <div className="w-full max-w-6xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-10">
          <div className="min-w-0 space-y-8">
            <header className="space-y-3">
              {categoryName && (
                <div className="text-xs font-medium text-muted-foreground">{categoryName}</div>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{summary}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {compatibleProviders.map((p) => (
                  <ProviderBadge key={p} provider={p} showLabel={false} />
                ))}
              </div>
            </header>

            <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-2.5">
              <CopySkillDropdown
                skillId={skill.id}
                slug={skill.slug}
                title={title}
                summary={summary}
                content={content}
                locale={locale}
              />
              <DownloadSkillButton
                skillId={skill.id}
                content={content}
                filename={`${skill.slug}.md`}
                label={t("download")}
              />
              {(skill.copyCount > 0 || skill.downloadCount > 0) && (
                <span className="text-xs font-mono text-muted-foreground sm:pl-2">
                  {skill.copyCount > 0 && `${skill.copyCount} ${isEn ? "copies" : "salinan"}`}
                  {skill.copyCount > 0 && skill.downloadCount > 0 && " • "}
                  {skill.downloadCount > 0 && `${skill.downloadCount} ${isEn ? "downloads" : "unduhan"}`}
                </span>
              )}
            </div>

            <CliInstallBox slug={skill.slug} locale={locale} />

            {getImageList(skill.images, skill.previewImageUrl).length > 0 && (
              <section aria-labelledby="gallery-heading" className="space-y-3">
                <h2
                  id="gallery-heading"
                  className="text-sm font-semibold text-foreground tracking-tight"
                >
                  {isEn ? "Gallery" : "Galeri"}
                </h2>
                <ImageGallery
                  images={getImageList(skill.images, skill.previewImageUrl)}
                  alt={title}
                />
              </section>
            )}

            <SkillDetailTabs
              hasPreview={hasPreview}
              previewNode={previewNode}
              contentNode={contentNode}
              rawNode={rawNode}
              locale={locale}
            />

            <section
              aria-labelledby="install-heading"
              className="p-4 sm:p-5 rounded-xl border border-border bg-muted/30 space-y-3 text-xs"
            >
              <h2 id="install-heading" className="font-semibold text-foreground tracking-tight">
                {t("installGuide")}
              </h2>
              <ol className="list-decimal pl-4 space-y-1.5 text-muted-foreground leading-relaxed">
                <li>{t("installStep1")}</li>
                <li>{t("installStep2")}</li>
                <li>{t("installStep3")}</li>
              </ol>
            </section>

            <section
              aria-labelledby="provenance-heading"
              className="p-4 rounded-xl border border-border bg-surface space-y-3 text-xs"
            >
              <h2 id="provenance-heading" className="font-semibold text-foreground tracking-tight">
                {t("provenance")}
              </h2>

              {skill.sourceType === "github" ? (
                <div className="space-y-1.5 text-muted-foreground">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{t("sourceRepo")}:</span>
                    {skill.repoUrl ? (
                      <a
                        href={skill.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-foreground hover:underline inline-flex items-center gap-1"
                      >
                        <span>{skill.repoUrl.replace("https://github.com/", "")}</span>
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  {skill.filePath && (
                    <div className="flex items-center gap-2">
                      <span>{t("filePath")}:</span>
                      <span className="font-mono">{skill.filePath}</span>
                    </div>
                  )}

                  {skill.commitHash && (
                    <div className="flex items-center gap-2">
                      <span>{t("commit")}:</span>
                      <span className="font-mono">{skill.commitHash.slice(0, 7)}</span>
                    </div>
                  )}

                  {skill.license && (
                    <div className="flex items-center gap-2">
                      <span>{t("license")}:</span>
                      <span className="font-semibold text-foreground">{skill.license}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{t("originalWork")}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t("originalDesc")}</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <SkillStatsCard skill={skill} category={category} locale={locale} />
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-4 pt-10 mt-10 border-t border-border/60">
            <h2 id="related-heading" className="text-sm font-semibold text-foreground tracking-tight">
              {t("relatedSkills")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {related.map(({ skill: rSkill, category: rCategory }) => (
                <SkillCard key={rSkill.id} skill={rSkill} category={rCategory} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
