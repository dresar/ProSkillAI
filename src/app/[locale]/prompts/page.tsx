import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/db";
import { prompts, categories } from "@/db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import { PromptCard } from "@/components/prompt-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "AI Prompt Library" : "Kumpulan Prompt Rekayasa AI";
  const description = isEn
    ? "Verified software engineering, architecture, and anti-slop prompts with interactive variable substitution."
    : "Koleksi prompt rekayasa perangkat lunak, arsitektur, dan UI anti-slop dengan dukungan variabel dinamis siap pakai.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/prompts`,
      languages: {
        id: "https://proskillai.dev/id/prompts",
        en: "https://proskillai.dev/en/prompts",
        "x-default": "https://proskillai.dev/id/prompts",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/prompts`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function PromptsCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { q, category, sort } = await searchParams;

  setRequestLocale(locale);
  const t = await getTranslations("prompts");

  const allCategories = await db.select().from(categories);

  const conditions = [eq(prompts.status, "published")];

  if (category) {
    const selectedCat = allCategories.find((c) => c.slug === category);
    if (selectedCat) {
      conditions.push(eq(prompts.categoryId, selectedCat.id));
    }
  }

  if (q) {
    conditions.push(
      sql`(${prompts.titleId} ILIKE ${`%${q}%`} OR ${prompts.titleEn} ILIKE ${`%${q}%`} OR ${prompts.descriptionId} ILIKE ${`%${q}%`} OR ${prompts.descriptionEn} ILIKE ${`%${q}%`})`
    );
  }

  let orderByClause = desc(prompts.createdAt);
  if (sort === "oldest") {
    orderByClause = asc(prompts.createdAt);
  } else if (sort === "popular") {
    orderByClause = desc(prompts.copyCount);
  }

  const result = await db
    .select({
      prompt: prompts,
      category: categories,
    })
    .from(prompts)
    .leftJoin(categories, eq(prompts.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderByClause);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 md:py-12 space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          {t("subtitle")}
        </p>
      </div>

      <CatalogToolbar
        categories={allCategories}
        locale={locale}
        totalCount={result.length}
      />

      {result.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-500">
          {t("emptyState")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {result.map(({ prompt, category }) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
