import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllUiInspirations } from "@/db/queries";
import { UiInspirationCatalog } from "@/components/ui-inspiration-catalog";

export const dynamic = "force-dynamic";

interface InspirasiPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: "newest" | "popular" | "copied";
  }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "UI/UX Inspiration & Design Patterns | ProSkillAI"
    : "Inspirasi UI/UX & Pola Desain Komponen | ProSkillAI";
  const description = isEn
    ? "Explore modern, compact, anti-slop UI/UX design inspirations and copy-ready React & Tailwind CSS patterns. Powered 100% by Neon Serverless PostgreSQL."
    : "Koleksi kurasi inspirasi desain antarmuka modern, tenang, presisi, dan anti-slop. Siap salin komponen React & Tailwind CSS berbasis Neon Serverless.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const pageUrl = `${siteUrl}/${locale}/inspirasi`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/inspirasi`,
        id: `${siteUrl}/id/inspirasi`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "ProSkillAI",
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/share-card-bg.png`,
          width: 1200,
          height: 675,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/share-card-bg.png`],
    },
  };
}

export default async function InspirasiPage({
  params,
  searchParams,
}: InspirasiPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryParams = await searchParams;
  const items = await getAllUiInspirations({
    category: queryParams.category,
    search: queryParams.search,
    sort: queryParams.sort,
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "en" ? "UI/UX Inspiration & Design Patterns" : "Inspirasi Desain UI/UX & Pola Komponen",
    description:
      locale === "en"
        ? "Curated gallery of high-craft modern UI/UX design inspirations and copy-ready React components."
        : "Galeri kurasi pola desain antarmuka modern yang tenang, presisi, dan siap salin.",
    url: `${siteUrl}/${locale}/inspirasi`,
    numberOfItems: items.length,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: locale === "en" ? item.titleEn : item.titleId,
      url: `${siteUrl}/${locale}/inspirasi/${item.slug}`,
    })),
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UiInspirationCatalog initialItems={items} locale={locale} />
    </div>
  );
}
