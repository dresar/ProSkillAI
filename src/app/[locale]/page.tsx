import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFeaturedSkills, getLatestPrompts } from "@/db/queries";
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
    ? "Discover, preview, and install skills for AI coding agents, alongside verified engineering and product prompts with dynamic variables."
    : "Temukan, pratinjau, dan pasang skill untuk AI coding agent serta salin prompt siap pakai dengan variabel dinamis.";

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

  const [publishedSkills, publishedPrompts] = await Promise.all([
    getFeaturedSkills(6),
    getLatestPrompts(4),
  ]);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
      <section className="max-w-3xl space-y-5">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-[1.2]">
          {t("title")}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
          {t("subtitle")}
        </p>

        <form action={`/${locale}/skills`} method="GET" className="relative max-w-lg pt-2">
          <label htmlFor="home-search" className="sr-only">
            {t("searchPlaceholder")}
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
          <input
            id="home-search"
            name="q"
            type="search"
            placeholder={t("searchPlaceholder")}
            className="w-full h-11 pl-10 pr-24 text-sm rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground focus:outline-2 focus:outline-foreground shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
          >
            {locale === "en" ? "Explore" : "Telusuri"}
          </button>
        </form>
      </section>

      <section className="space-y-6" aria-labelledby="skills-heading">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 id="skills-heading" className="text-base font-semibold text-foreground tracking-tight">
              {t("featuredSkills")}
            </h2>
          </div>
          <Link
            href={`/${locale}/skills`}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors"
          >
            <span>{t("viewAllSkills")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {publishedSkills.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-500">
            {t("emptySkills")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <section className="space-y-6" aria-labelledby="prompts-heading">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 id="prompts-heading" className="text-base font-semibold text-foreground tracking-tight">
              {t("latestPrompts")}
            </h2>
          </div>
          <Link
            href={`/${locale}/prompts`}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors"
          >
            <span>{t("viewAllPrompts")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {publishedPrompts.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-500">
            {t("emptyPrompts")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
