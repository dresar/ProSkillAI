import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/db";
import { skills, categories } from "@/db/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import { SkillCard } from "@/components/skill-card";
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

  const title = isEn ? "Agent Skills Catalogue" : "Katalog Skill AI Agent";
  const description = isEn
    ? "Browse verified instructions, visual designs, and design tokens for AI coding agents."
    : "Telusuri kumpulan instruksi skill, desain visual, dan token terverifikasi untuk AI coding agent.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}/skills`,
      languages: {
        id: "https://proskillai.dev/id/skills",
        en: "https://proskillai.dev/en/skills",
        "x-default": "https://proskillai.dev/id/skills",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}/skills`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function SkillsCatalogPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { q, category, sort } = await searchParams;

  setRequestLocale(locale);
  const t = await getTranslations("skills");

  const allCategories = await db.select().from(categories);

  const conditions = [eq(skills.status, "published")];

  if (category) {
    const selectedCat = allCategories.find((c) => c.slug === category);
    if (selectedCat) {
      conditions.push(eq(skills.categoryId, selectedCat.id));
    }
  }

  if (q) {
    conditions.push(
      sql`(${skills.titleId} ILIKE ${`%${q}%`} OR ${skills.titleEn} ILIKE ${`%${q}%`} OR ${skills.summaryId} ILIKE ${`%${q}%`} OR ${skills.summaryEn} ILIKE ${`%${q}%`})`
    );
  }

  let orderByClause = desc(skills.createdAt);
  if (sort === "oldest") {
    orderByClause = asc(skills.createdAt);
  } else if (sort === "popular") {
    orderByClause = desc(skills.copyCount);
  }

  const result = await db
    .select({
      skill: skills,
      category: categories,
    })
    .from(skills)
    .leftJoin(categories, eq(skills.categoryId, categories.id))
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
          {locale === "en"
            ? "No published skills matched your filters."
            : "Tidak ada skill terbit yang cocok dengan kriteria filter Anda."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.map(({ skill, category }) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              category={category}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
