import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  fetchRepoDetails,
  fetchRepoReadme,
  formatCompactNumber,
} from "@/lib/github-trending";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareButton } from "@/components/share";
import { RepoCloneBox } from "./repo-clone-box";
import {
  ArrowLeft,
  Star,
  GitFork,
  CircleDot,
  ExternalLink,
  BookOpen,
  Calendar,
  Shield,
  GitBranch,
  User,
} from "lucide-react";

interface RepoDetailPageProps {
  params: Promise<{
    locale: string;
    owner: string;
    repo: string;
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

export async function generateMetadata({
  params,
}: RepoDetailPageProps): Promise<Metadata> {
  const { locale, owner, repo } = await params;
  const isEn = locale === "en";

  const repoData = await fetchRepoDetails(owner, repo);
  if (!repoData) {
    return {
      title: "Repository Not Found | Skills",
    };
  }

  const title = isEn
    ? `${repoData.fullName} - Trending GitHub Repository | Skills`
    : `${repoData.fullName} - Repositori GitHub Trending | Skills`;

  const description =
    repoData.description ||
    (isEn
      ? `Explore ${repoData.fullName} with documentation, clone instructions, and metrics.`
      : `Jelajahi ${repoData.fullName} lengkap dengan dokumentasi, perintah clone, dan metrik.`);

  const ogImage = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  const canonicalUrl = `${SITE_URL}/${locale}/trending/${owner}/${repo}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${SITE_URL}/id/trending/${owner}/${repo}`,
        en: `${SITE_URL}/en/trending/${owner}/${repo}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Skills",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 600,
          alt: repoData.fullName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function RepoDetailPage({ params }: RepoDetailPageProps) {
  const { locale, owner, repo } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const [repoData, readmeContent] = await Promise.all([
    fetchRepoDetails(owner, repo),
    fetchRepoReadme(owner, repo),
  ]);

  if (!repoData) {
    notFound();
  }

  const isEn = locale === "en";
  const ogImage = `https://opengraph.githubassets.com/1/${owner}/${repo}`;
  const canonicalUrl = `${SITE_URL}/${locale}/trending/${owner}/${repo}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
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
            name: isEn ? "Trending" : "Trending",
            item: `${SITE_URL}/${locale}/trending`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: repoData.fullName,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "SoftwareSourceCode",
        name: repoData.fullName,
        description: repoData.description,
        programmingLanguage: repoData.language,
        codeRepository: repoData.htmlUrl,
        author: {
          "@type": repoData.owner.type === "Organization" ? "Organization" : "Person",
          name: repoData.owner.login,
          url: repoData.owner.htmlUrl,
          image: repoData.owner.avatarUrl,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/trending`}
            className="h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-xs font-medium text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? "Back to Trending" : "Kembali ke Trending"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShareButton
              item={{
                type: "repo",
                slug: repoData.name,
                title: repoData.fullName,
                description: repoData.description,
                url: canonicalUrl,
                category: repoData.language || "Open Source",
                author: repoData.owner.login,
                stats: [
                  { label: "Stars", value: formatCompactNumber(repoData.stars) },
                  { label: "Forks", value: formatCompactNumber(repoData.forks) },
                  { label: "Rank", value: `#${repoData.rank}` },
                ],
              }}
              locale={locale}
              showLabel
              label={isEn ? "Share Card" : "Bagi Kartu"}
              className="h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer"
            />

            <a
              href={repoData.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-8 px-3 rounded-[6px] border border-foreground bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>{isEn ? "GitHub Repo" : "Repo GitHub"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="relative aspect-video max-h-72 sm:max-h-84 w-full rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-sm">
          <Image
            src={ogImage}
            alt={repoData.fullName}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border/80 bg-muted shrink-0 shadow-2xs">
                <Image
                  src={repoData.owner.avatarUrl}
                  alt={repoData.owner.login}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-[5px] bg-muted border border-border text-foreground">
                    Rank #{repoData.rank}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-primary/10 text-primary border border-primary/20 font-semibold">
                    {repoData.language}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-muted border border-border text-muted-foreground">
                    {repoData.license}
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {repoData.fullName}
                </h1>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {repoData.description || (isEn ? "No repository description provided." : "Tidak ada deskripsi repositori.")}
          </p>

          {repoData.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {repoData.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-[5px] bg-background border border-border/80 text-muted-foreground"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/70">
            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">Stars</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {formatCompactNumber(repoData.stars)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <GitFork className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">Forks</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {formatCompactNumber(repoData.forks)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">Open Issues</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {formatCompactNumber(repoData.openIssues)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">Default Branch</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {repoData.defaultBranch}
                </div>
              </div>
            </div>
          </div>
        </div>

        <RepoCloneBox
          cloneUrl={repoData.htmlUrl}
          fullName={repoData.fullName}
          locale={locale}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-bold text-foreground font-mono">
                    README.md
                  </span>
                </div>
                <a
                  href={`${repoData.htmlUrl}#readme`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-1 hover:underline"
                >
                  <span>{isEn ? "View on GitHub" : "Lihat di GitHub"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="p-4 sm:p-6 overflow-x-auto">
                <MarkdownRenderer content={readmeContent} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3.5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                {isEn ? "Repository Info" : "Info Repositori"}
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Owner</span>
                  </span>
                  <a
                    href={repoData.owner.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:underline font-mono truncate max-w-[140px]"
                  >
                    {repoData.owner.login}
                  </a>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span>License</span>
                  </span>
                  <span className="font-medium text-foreground font-mono">
                    {repoData.license}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated</span>
                  </span>
                  <span className="font-medium text-foreground font-mono text-[11px]">
                    {new Date(repoData.updatedAt).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created</span>
                  </span>
                  <span className="font-medium text-foreground font-mono text-[11px]">
                    {new Date(repoData.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={repoData.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isEn ? "Open GitHub Page" : "Buka Halaman GitHub"}</span>
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-4 space-y-2 text-center">
              <h4 className="text-xs font-semibold text-foreground">
                {isEn ? "Explore More Projects" : "Eksplorasi Proyek Lainnya"}
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isEn
                  ? "Discover 100 open-source repositories and agent frameworks."
                  : "Temukan 100 repositori open-source dan framework agen AI."}
              </p>
              <Link
                href={`/${locale}/trending`}
                className="inline-block mt-2 h-7.5 px-3 rounded-[5px] border border-foreground bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                {isEn ? "Browse Top 100" : "Lihat Top 100"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
