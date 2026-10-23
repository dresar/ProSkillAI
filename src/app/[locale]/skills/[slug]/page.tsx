import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublishedSkillBySlug, getRelatedSkills, getSidebarPrompts } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import { CopySkillDropdown } from "@/components/copy-skill-dropdown";
import { DownloadSkillButton } from "@/components/download-skill-button";
import { ShareButton } from "@/components/share";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { SkillPreviewViewer } from "@/components/skill-preview-viewer";
import { SkillCard } from "@/components/skill-card";
import { SkillDetailTabs } from "@/components/skill-detail-tabs";
import { SkillStatsCard } from "@/components/skill-stats-card";
import { PromptsSidebarBanner } from "@/components/prompts-sidebar-banner";
import { SkillAiChat } from "@/components/skill-ai-chat";
import { CliInstallBox } from "@/components/cli-install-box";
import { SkillFilesViewer } from "@/components/skill-files-viewer";
import { ProviderBadge, type ProviderId } from "@/components/provider-logos";
import { ImageGallery } from "@/components/admin/image-gallery";
import { getSkillCoverImage, getImageList } from "@/lib/images";
import type { SkillFileItem } from "@/db/schema";

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

  const user = await getCurrentUser();
  const { skill, category } = item;
  const isEn = locale === "en";
  const title = isEn ? skill.titleEn : skill.titleId;
  const summary = isEn ? skill.summaryEn : skill.summaryId;
  const content = isEn ? skill.contentEn : skill.contentId;
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;

  const [related, sidebarPrompts] = await Promise.all([
    skill.categoryId ? getRelatedSkills(skill.categoryId, skill.id, 4) : Promise.resolve([]),
    getSidebarPrompts(3),
  ]);

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

  const attachedFiles: SkillFileItem[] = Array.isArray(skill.files)
    ? (skill.files as unknown as SkillFileItem[])
    : [];

  const filesNode = (
    <section aria-labelledby="files-heading" className="space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 id="files-heading" className="text-sm font-semibold text-foreground tracking-tight">
          {isEn ? "Auxiliary Skill Files" : "Berkas Pendukung Skill"}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{attachedFiles.length} file</span>
      </div>
      <SkillFilesViewer files={attachedFiles} locale={locale} />
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

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-border/70">
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-foreground hover:opacity-85 transition-all group px-3 py-1.5 rounded-[6px] border border-border bg-surface hover:bg-muted shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isEn ? "Back to Skills" : "Kembali ke Katalog Skill"}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">home</Link>
            <span>/</span>
            <Link href={`/${locale}/skills`} className="hover:text-foreground transition-colors">skills</Link>
            <span>/</span>
            <span className="text-foreground font-semibold truncate max-w-[220px]">{slug}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8">
          <div className="min-w-0 space-y-5 sm:space-y-6">
            <header className="space-y-2.5">
              {categoryName && (
                <div className="text-xs font-medium text-muted-foreground">{categoryName}</div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">{summary}</p>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {compatibleProviders.map((p) => (
                  <ProviderBadge key={p} provider={p} showLabel={false} />
                ))}
              </div>
            </header>

            <div className="flex items-center gap-1.5 flex-wrap">
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
                showLabel={false}
                className="w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground flex items-center justify-center shadow-2xs transition-all cursor-pointer"
              />
              <ShareButton
                item={{
                  type: "skill",
                  slug: skill.slug,
                  title,
                  description: summary,
                  url: `/${locale}/skills/${skill.slug}`,
                  category: categoryName || undefined,
                  author: authorName,
                  stats: [
                    { label: "Stars", value: skill.copyCount > 0 ? String(skill.copyCount) : "4.8k" },
                    { label: "Files", value: attachedFiles.length },
                  ],
                }}
                locale={locale}
                className="w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground flex items-center justify-center shadow-2xs transition-all cursor-pointer"
              />
            </div>

            <CliInstallBox slug={skill.slug} locale={locale} />

            {getImageList(skill.images, skill.previewImageUrl).length > 0 && (
              <section aria-labelledby="gallery-heading" className="space-y-2.5">
                <h2
                  id="gallery-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
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
              filesNode={filesNode}
              filesCount={attachedFiles.length}
              locale={locale}
            />

            <section
              aria-labelledby="install-heading"
              className="p-3.5 sm:p-4 rounded-xl border border-border bg-muted/30 space-y-2 text-xs"
            >
              <h2 id="install-heading" className="font-semibold text-foreground tracking-tight">
                {t("installGuide")}
              </h2>
              <ol className="list-decimal pl-4 space-y-1 text-muted-foreground leading-relaxed">
                <li>{t("installStep1")}</li>
                <li>{t("installStep2")}</li>
                <li>{t("installStep3")}</li>
              </ol>
            </section>
          </div>

          <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
            <SkillStatsCard skill={skill} category={category} locale={locale} />
            <PromptsSidebarBanner locale={locale} prompts={sidebarPrompts} />
          </div>
        </div>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="space-y-3 pt-6 mt-8 border-t border-border/70">
            <h2 id="related-heading" className="text-sm font-semibold text-foreground tracking-tight">
              {t("relatedSkills")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {related.map(({ skill: rSkill, category: rCategory }) => (
                <SkillCard key={rSkill.id} skill={rSkill} category={rCategory} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SkillAiChat
        skillId={skill.id}
        skillTitle={title}
        skillSummary={summary}
        locale={locale}
        user={
          user
            ? {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                aiCredits: user.aiCredits,
              }
            : null
        }
      />
    </article>
  );
}
