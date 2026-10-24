import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MCP_SERVERS_CATALOG, type McpServerItem } from "@/data/mcp-catalog";
import { formatCompactNumber } from "@/lib/github-trending";
import { ShareButton } from "@/components/share";
import { getMcpCoverImage } from "@/lib/images";
import { McpInstallTabs } from "./mcp-install-tabs";
import {
  ArrowLeft,
  Boxes,
  ExternalLink,
  ShieldCheck,
  Star,
  Wrench,
  Layers,
  Building2,
  FileCode,
  CheckCircle2,
} from "lucide-react";

interface McpDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

export async function generateMetadata({
  params,
}: McpDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const server = MCP_SERVERS_CATALOG.find(
    (s) => s.slug === slug || s.id === slug
  );

  if (!server) {
    return {
      title: "MCP Server Not Found | Skills",
    };
  }

  const title = isEn
    ? `${server.name} MCP Server (${server.vendor}) | Skills`
    : `Server MCP ${server.name} (${server.vendor}) | Skills`;

  const description =
    server.description ||
    (isEn
      ? `Connect ${server.name} to Claude Desktop, Cursor, and autonomous agent frameworks.`
      : `Hubungkan ${server.name} ke Claude Desktop, Cursor, dan framework agen AI.`);

  const ogImage = `${SITE_URL}/images/default-skill.png`;
  const canonicalUrl = `${SITE_URL}/${locale}/mcp/${server.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${SITE_URL}/id/mcp/${server.slug}`,
        en: `${SITE_URL}/en/mcp/${server.slug}`,
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
          width: 800,
          height: 400,
          alt: server.name,
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

export default async function McpDetailPage({ params }: McpDetailPageProps) {
  const { locale, slug } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const server = MCP_SERVERS_CATALOG.find(
    (s) => s.slug === slug || s.id === slug
  );

  if (!server) {
    notFound();
  }

  const isEn = locale === "en";
  const ogImage = `/images/mcp/${server.category}.svg`;
  const canonicalUrl = `${SITE_URL}/${locale}/mcp/${server.slug}`;

  const relatedServers = MCP_SERVERS_CATALOG.filter(
    (s) => s.category === server.category && s.slug !== server.slug
  ).slice(0, 4);

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
            name: "MCP",
            item: `${SITE_URL}/${locale}/mcp`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: server.name,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: server.name,
        description: server.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        author: {
          "@type": "Organization",
          name: server.vendor,
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
            href={`/${locale}/mcp`}
            className="h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-xs font-medium text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? "Back to MCP Directory" : "Kembali ke Direktori MCP"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShareButton
              item={{
                type: "mcp",
                slug: server.id,
                title: server.name,
                description: server.description,
                url: canonicalUrl,
                category: server.categoryLabel,
                author: server.vendor,
                stats: [
                  { label: "Tools", value: server.tools.length },
                  { label: "Stars", value: formatCompactNumber(server.stars) },
                  { label: "License", value: server.isOpenSource ? "OSS" : "Commercial" },
                ],
              }}
              locale={locale}
              showLabel
              label={isEn ? "Share Card" : "Bagi Kartu"}
              className="h-8 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer"
            />

            {server.githubUrl && (
              <a
                href={server.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-[6px] border border-foreground bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <span>{isEn ? "GitHub Repo" : "Repo GitHub"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        <div className="relative aspect-video max-h-64 sm:max-h-72 w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/40 shadow-xs flex items-center justify-center">
          <Image
            src={getMcpCoverImage(server.imageUrl)}
            alt={server.name}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center shrink-0 shadow-2xs">
                <Boxes className="w-6 h-6 text-background" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-[5px] bg-muted border border-border text-foreground">
                    {server.categoryLabel}
                  </span>
                  {server.isOpenSource && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      Open Source
                    </span>
                  )}
                  {server.isSelfHostable && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                      Self-Hostable
                    </span>
                  )}
                  {server.verified && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-[5px] bg-primary/10 text-primary border border-primary/20 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  {server.name}
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  {isEn ? "Maintained by" : "Dikelola oleh"} {server.vendor}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {server.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/70">
            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">
                  {isEn ? "Tools Count" : "Jumlah Tool"}
                </div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {server.tools.length} exposed
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">GitHub Stars</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {formatCompactNumber(server.stars)}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">Category</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  {server.category}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg border border-border/60 bg-background flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-muted-foreground font-mono">MCP Protocol</div>
                <div className="text-xs font-bold text-foreground font-mono truncate">
                  v1.0 Ready
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <FileCode className="w-4 h-4 text-primary" />
              <span>{isEn ? "Configuration & Quick Install" : "Konfigurasi & Instalasi Cepat"}</span>
            </h2>
            <span className="text-[11px] font-mono text-muted-foreground">
              {isEn ? "One-click copy configuration" : "Konfigurasi sekali klik"}
            </span>
          </div>

          <McpInstallTabs
            serverName={server.name}
            installSnippet={server.installSnippet}
            claudeConfigSnippet={server.claudeConfigSnippet}
            locale={locale}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono">
                    {isEn ? "Exposed Agent Tool Functions" : "Fungsi Tool Agen yang Disediakan"}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-[5px] bg-muted text-muted-foreground">
                  {server.tools.length} {isEn ? "tools" : "fungsi"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {server.tools.map((tool) => (
                  <div
                    key={tool}
                    className="p-3 rounded-xl border border-border/70 bg-background flex items-start gap-2.5 hover:border-foreground/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-[5px] bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <Wrench className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <code className="text-xs font-mono font-bold text-foreground truncate block">
                        {tool}()
                      </code>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        {isEn
                          ? `Executable tool function exposed through the MCP runtime interface.`
                          : `Fungsi tool yang dapat dipanggil langsung melalui antarmuka MCP.`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-4 space-y-3.5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                {isEn ? "Provider & Metadata" : "Penyedia & Metadata"}
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Vendor</span>
                  </span>
                  <span className="font-medium text-foreground font-mono truncate max-w-[140px]">
                    {server.vendor}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Category</span>
                  </span>
                  <span className="font-medium text-foreground font-mono truncate max-w-[140px]">
                    {server.category}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">License</span>
                  <span className="font-medium text-foreground font-mono">
                    {server.isOpenSource ? "Open Source" : "Commercial"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Self-Hostable</span>
                  <span className="font-medium text-foreground font-mono">
                    {server.isSelfHostable ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {server.websiteUrl && (
                <div className="pt-2">
                  <a
                    href={server.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isEn ? "Official Documentation" : "Dokumentasi Resmi"}</span>
                  </a>
                </div>
              )}
            </div>

            {relatedServers.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-4 space-y-3 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  {isEn ? "Related in Category" : "Terkait dalam Kategori"}
                </h4>
                <div className="space-y-2">
                  {relatedServers.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/${locale}/mcp/${rel.slug}`}
                      className="block p-2.5 rounded-xl border border-border/60 bg-background hover:border-foreground/40 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:underline truncate">
                        <span>{rel.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground font-normal">
                          {formatCompactNumber(rel.stars)} ★
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                        {rel.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
