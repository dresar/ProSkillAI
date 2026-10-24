import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fetchGitHubTrending } from "@/lib/github-trending";
import { TrendingClient } from "./trending-client";

interface TrendingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: TrendingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Top 100 Trending GitHub Repositories | Skills"
    : "100 Repositori GitHub Paling Trending | Skills";

  const description = isEn
    ? "Explore the top 100 trending open-source GitHub repositories, agent frameworks, and developer libraries with full README previews and clone instructions."
    : "Jelajahi 100 repositori GitHub open-source, framework agen AI, dan pustaka developer paling trending lengkap dengan pratinjau README dan panduan clone.";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const canonicalUrl = `${baseUrl}/${locale}/trending`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${baseUrl}/id/trending`,
        en: `${baseUrl}/en/trending`,
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

export default async function TrendingPage({ params }: TrendingPageProps) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const { repos, isLive } = await fetchGitHubTrending({ range: "all" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "en" ? "Top 100 Trending GitHub Repositories" : "100 Repositori GitHub Trending Teratas",
    description: "Curated index of the most popular open-source repositories and agent toolkits on GitHub.",
    numberOfItems: repos.length,
    itemListElement: repos.slice(0, 30).map((repo, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: repo.fullName,
        description: repo.description,
        programmingLanguage: repo.language,
        codeRepository: repo.htmlUrl,
        author: {
          "@type": repo.owner.type === "Organization" ? "Organization" : "Person",
          name: repo.owner.login,
          url: repo.owner.htmlUrl,
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
        name: locale === "en" ? "GitHub Trending" : "Trending GitHub",
        item: `${baseUrl}/${locale}/trending`,
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
      <TrendingClient initialRepos={repos} locale={locale} isLive={isLive} />
    </>
  );
}
