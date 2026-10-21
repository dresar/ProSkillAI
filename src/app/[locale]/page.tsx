import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFeaturedSkills, getLatestPrompts, getAllCategories } from "@/db/queries";
import { SkillCard } from "@/components/skill-card";
import { PromptCard } from "@/components/prompt-card";
import { BetaSections } from "@/components/beta-sections";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "Open Catalogue of AI Agent Skills & Prompt Library"
    : "Katalog Terbuka Skill Agent & Kumpulan Prompt AI";
  const description = isEn
    ? "UX, visual, brand, design systems, and code automation for Cursor, Claude Code, and autonomous AI agents."
    : "UX, visual, brand, sistem desain, dan otomasi kode untuk Cursor, Claude Code, serta AI agent mandiri.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://proskillai.dev/${locale}`,
      languages: {
        id: "https://proskillai.dev/id",
        en: "https://proskillai.dev/en",
        "x-default": "https://proskillai.dev/id",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://proskillai.dev/${locale}`,
      siteName: "ProSkillAI",
      locale: isEn ? "en_US" : "id_ID",
      type: "website",
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const [publishedSkills, publishedPrompts, allCategories] = await Promise.all([
    getFeaturedSkills(9),
    getLatestPrompts(6),
    getAllCategories("all"),
  ]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
      <section className="space-y-4 max-w-3xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <form action={`/${locale}/skills`} method="GET" className="relative max-w-xl">
            <label htmlFor="home-search" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full h-10 pl-10 pr-24 text-xs sm:text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-md text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
            >
              {locale === "en" ? "Search" : "Cari"}
            </button>
          </form>

          {allCategories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <Link
                href={`/${locale}/skills`}
                className="px-2.5 py-1 rounded-md border border-border bg-muted/40 hover:bg-muted text-foreground font-medium transition-colors"
              >
                {locale === "en" ? "All" : "Semua"}
              </Link>
              {allCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${locale}/skills?category=${cat.slug}`}
                  className="px-2.5 py-1 rounded-md border border-border/60 hover:border-border bg-surface hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {locale === "en" ? cat.nameEn : cat.nameId}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="skills-heading">
        <div className="flex items-end justify-between pb-3 border-b border-border">
          <div>
            <h2 id="skills-heading" className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              {t("featuredSkills")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("skillsSubtitle")}
            </p>
          </div>
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <span>{t("viewAllSkills")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {publishedSkills.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
            {t("emptySkills")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {publishedSkills.map(({ skill, category }) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                category={category}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4" aria-labelledby="prompts-heading">
        <div className="flex items-end justify-between pb-3 border-b border-border">
          <div>
            <h2 id="prompts-heading" className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
              {t("latestPrompts")}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("promptsSubtitle")}
            </p>
          </div>
          <Link
            href={`/${locale}/prompts`}
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <span>{t("viewAllPrompts")}</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {publishedPrompts.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
            {t("emptyPrompts")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {publishedPrompts.map(({ prompt, category }) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                category={category}
                locale={locale}
              />
            ))}
          </div>
        )}
      </section>

      <BetaSections />
    </div>
  );
}
