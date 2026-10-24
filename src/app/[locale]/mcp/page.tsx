import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { MCP_SERVERS_CATALOG, MCP_CATALOG_STATS } from "@/data/mcp-catalog";
import { McpClient } from "./mcp-client";

interface McpPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: McpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "139 MCP Servers, One Index | The Stack Underneath the Agent"
    : "139 MCP Server dalam Satu Direktori | Stack di Bawah AI Agent";

  const description = isEn
    ? "Explore 139 MCP servers across 11 categories. Discover frameworks, execution sandboxes, memory layers, and observability tooling for Claude Code, Cursor, and autonomous agents."
    : "Jelajahi 139 server MCP di 11 kategori. Temukan framework, sandbox eksekusi, memori persisten, dan perkakas observabilitas untuk Claude Code, Cursor, dan agen otonom.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const canonicalUrl = `${baseUrl}/${locale}/mcp`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${baseUrl}/id/mcp`,
        en: `${baseUrl}/en/mcp`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Skills",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function McpPage({ params }: McpPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "en" ? "139 MCP Servers Directory" : "Direktori 139 Server MCP",
    description: MCP_CATALOG_STATS.heroSubtitle,
    numberOfItems: MCP_SERVERS_CATALOG.length,
    itemListElement: MCP_SERVERS_CATALOG.slice(0, 30).map((server, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "SoftwareApplication",
        name: server.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        description: server.description,
        author: {
          "@type": "Organization",
          name: server.vendor,
        },
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "en" ? "Home" : "Beranda",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "en" ? "MCP Servers" : "Server MCP",
        item: `${baseUrl}/${locale}/mcp`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <McpClient servers={MCP_SERVERS_CATALOG} locale={locale} />
    </>
  );
}
