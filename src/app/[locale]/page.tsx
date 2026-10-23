import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedSkills, getLatestPrompts, getAllCategories } from "@/db/queries";
import { OnePageCatalog } from "@/components/one-page-catalog";
import { BetaSections } from "@/components/beta-sections";
import { Terminal, ShieldCheck, Star } from "lucide-react";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn
    ? "ProSkillAI | AI Agent Skills Directory & Verified Prompts"
    : "ProSkillAI | Direktori Skill Agen AI & Pustaka Prompt Terverifikasi";
  const description = isEn
    ? "Verified instructions, system rules, and design tokens for AI coding agents. S-rank frontend art direction, architecture, and optimization."
    : "Kumpulan instruksi skill terverifikasi, aturan sistem, dan token untuk AI coding agent. Art direction frontend S-rank, arsitektur, dan optimasi.";

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
  const isEn = locale === "en";

  const [publishedSkills, publishedPrompts, allCategories] = await Promise.all([
    getPublishedSkills({}),
    getLatestPrompts(24),
    getAllCategories("all"),
  ]);

  return (
    <div className="w-full px-4 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">
      <section className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border/80 shadow-2xs text-[10px] sm:text-[11px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-foreground">
            {isEn ? "Agent Skills Directory" : "Direktori Skill Agen AI"}
          </span>
          <span className="text-border">|</span>
          <span className="font-mono text-[10px]">
            {publishedSkills.length} {isEn ? "skills" : "skill"}
          </span>
        </div>

        <h1 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {isEn
            ? "Verified Agent Skills for Modern AI Engineering"
            : "Direktori Skill Terverifikasi untuk AI Coding Agent"}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {isEn
            ? "Equip Claude Code, Cursor, and Codex agents with S-rank frontend taste, AST codebase intelligence, and scalable backend architecture."
            : "Lengkapi Claude Code, Cursor, dan Codex dengan skill S-rank frontend, knowledge graph AST, dan arsitektur backend terukur."}
        </p>

        <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 pt-0.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-muted/60 border border-border/60">
            <Terminal className="w-3 h-3 text-foreground" />
            <span>npx skills add</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-muted/60 border border-border/60">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>{isEn ? "GitHub S-Rank" : "Standar S-Rank"}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[5px] bg-muted/60 border border-border/60">
            <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
            <span>{isEn ? "1M+ GitHub Stars" : "1Jt+ Bintang GitHub"}</span>
          </span>
        </div>
      </section>

      <OnePageCatalog
        skills={publishedSkills}
        prompts={publishedPrompts}
        categories={allCategories}
        locale={locale}
      />

      <BetaSections />
    </div>
  );
}
