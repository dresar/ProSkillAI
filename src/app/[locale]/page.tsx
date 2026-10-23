import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFeaturedSkills, getLatestPrompts, getAllCategories } from "@/db/queries";
import { SkillCard } from "@/components/skill-card";
import { PromptCard } from "@/components/prompt-card";
import { BetaSections } from "@/components/beta-sections";
import Link from "next/link";
import { ArrowRight, Search, ChevronDown } from "lucide-react";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "AI Agent Skills & Prompts | ProSkillAI"
    : "Katalog Skill & Prompt AI | ProSkillAI";
  const description = isEn
    ? "Curated coding skills, system instructions, and verified prompts for AI agents."
    : "Koleksi skill koding, aturan sistem, dan templat prompt terverifikasi untuk AI agent.";

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
    <div className="w-full px-4 sm:px-6 py-3 sm:py-4 space-y-5 sm:space-y-6">
      <section className="space-y-3 max-w-2xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {t("title")}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <form action={`/${locale}/skills`} method="GET" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 max-w-2xl">
          <div className="relative flex-1">
            <label htmlFor="home-search" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="home-search"
              name="q"
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-foreground shadow-2xs"
            />
          </div>

          {allCategories.length > 0 && (
            <div className="relative shrink-0">
              <label htmlFor="home-category" className="sr-only">
                {t("allCategories")}
              </label>
              <select
                id="home-category"
                name="category"
                defaultValue=""
                className="w-full sm:w-auto h-9 pl-3 pr-8 text-xs font-medium rounded-lg border border-border bg-surface text-foreground appearance-none cursor-pointer hover:border-foreground/40 focus:outline-2 focus:outline-foreground shadow-2xs transition-colors"
              >
                <option value="">{t("allCategories")}</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.slug} className="bg-surface text-foreground">
                    {locale === "en" ? cat.nameEn : cat.nameId}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          )}
        </form>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
