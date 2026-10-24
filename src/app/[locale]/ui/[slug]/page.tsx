import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getUiInspirationBySlug, getAllUiInspirations } from "@/db/queries";
import { UiInspirationDetailView } from "@/components/ui-inspiration-detail-view";

export const dynamic = "force-dynamic";

interface DetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getUiInspirationBySlug(slug);

  if (!item) {
    return {
      title: "Pattern Not Found | ProSkillAI",
    };
  }

  const isEn = locale === "en";
  const title = isEn
    ? `${item.titleEn} — Design Trends | ProSkillAI`
    : `${item.titleId} — Design Trends | ProSkillAI`;
  const description = isEn ? item.descriptionEn : item.descriptionId;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const pageUrl = `${siteUrl}/${locale}/ui/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: {
        en: `${siteUrl}/en/ui/${slug}`,
        id: `${siteUrl}/id/ui/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "ProSkillAI",
      type: "article",
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

export default async function InspirationDetailPage({ params }: DetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = await getUiInspirationBySlug(slug);
  if (!item) {
    notFound();
  }

  const allInspirations = await getAllUiInspirations();
  const relatedItems = allInspirations
    .filter((it) => it.slug !== slug && (it.category === item.category || it.id !== item.id))
    .slice(0, 3);

  const isEn = locale === "en";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skills.biz.id";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: isEn ? item.titleEn : item.titleId,
    description: isEn ? item.descriptionEn : item.descriptionId,
    programmingLanguage: "TypeScript, React, Tailwind CSS",
    codeSampleType: "full snippet",
    text: item.componentSnippet,
    url: `${siteUrl}/${locale}/ui/${slug}`,
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UiInspirationDetailView
        item={item}
        relatedItems={relatedItems}
        locale={locale}
      />
    </div>
  );
}
