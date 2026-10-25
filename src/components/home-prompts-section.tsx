import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Prompt, Category } from "@/db/schema";
import { PromptCard } from "@/components/prompt-card";

interface HomePromptsSectionProps {
  prompts: Array<{ prompt: Prompt; category: Category | null }>;
  locale: string;
}

export function HomePromptsSection({ prompts, locale }: HomePromptsSectionProps) {
  const isEn = locale === "en";
  const previewPrompts = (prompts || []).slice(0, 8);

  if (previewPrompts.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby="home-prompts-heading">
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-foreground" />
          <h2
            id="home-prompts-heading"
            className="text-xs sm:text-sm font-semibold tracking-tight text-foreground"
          >
            {isEn ? "Verified Prompt Templates" : "Templat Prompt Terverifikasi"}
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
            {previewPrompts.length}
          </span>
        </div>
        <Link
          href={`/${locale}/prompts`}
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all hover:border-foreground/20 active:scale-95 cursor-pointer group"
        >
          <span>{isEn ? "View all prompts" : "Selengkapnya"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {previewPrompts.map(({ prompt, category }) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            category={category}
            locale={locale}
          />
        ))}
      </div>

      <div className="pt-2 flex justify-center">
        <Link
          href={`/${locale}/prompts`}
          className="inline-flex items-center gap-2 h-8.5 px-4 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all hover:border-foreground/30 active:scale-95 cursor-pointer group"
        >
          <span>{isEn ? "Explore all prompt templates" : "Lihat selengkapnya di direktori prompt"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
