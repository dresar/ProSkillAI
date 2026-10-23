"use client";

import Link from "next/link";
import { Star, Sparkles, Terminal } from "lucide-react";
import { motion } from "motion/react";
import type { Prompt, Category } from "@/db/schema";
import { formatCount, getCategoryColor } from "@/lib/format";
import { FavoriteButton } from "@/components/favorite-button";

interface PromptCardProps {
  prompt: Prompt;
  category?: Category | null;
  locale: string;
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function PromptCard({ prompt, category, locale }: PromptCardProps) {
  const isEn = locale === "en";
  const title = isEn ? prompt.titleEn : prompt.titleId;
  const description = isEn ? prompt.descriptionEn : prompt.descriptionId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : isEn
    ? "Prompt Engineering"
    : "Rekayasa Prompt";

  const authorName = "ProSkillAI";
  const colorClass = getCategoryColor(category?.slug || categoryName);

  const variables = (prompt.variables as string[] | null) || [];
  const starCount = prompt.copyCount > 0 ? formatCount(prompt.copyCount) : "3.2k";

  return (
    <Link
      href={`/${locale}/prompts/${prompt.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface p-3.5 sm:p-4 hover:border-foreground/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25 transition-colors duration-200 shadow-xs relative"
      >
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            item={{
              id: prompt.id,
              type: "prompt",
              slug: prompt.slug,
              title,
              summary: description,
              category: categoryName,
            }}
            className="w-7 h-7 rounded-[6px] bg-background/80 backdrop-blur-xs border border-border/80 flex items-center justify-center hover:bg-background transition-all shadow-2xs"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2 pr-8">
            <span className={`text-[11px] sm:text-xs font-medium tracking-tight truncate ${colorClass}`}>
              {categoryName}
            </span>
            {variables.length > 0 && (
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                {variables.length} vars
              </span>
            )}
          </div>

          <h3 className="text-xs sm:text-[14px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/90 transition-colors line-clamp-1 pr-6">
            {title}
          </h3>

          <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[30px] sm:min-h-[34px]">
            {description}
          </p>
        </div>

        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-border/60 text-[11px] sm:text-xs text-muted-foreground">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open("https://github.com/dresar/ProSkillAI", "_blank", "noopener,noreferrer");
            }}
            title="ProSkillAI on GitHub"
            className="flex items-center gap-1.5 sm:gap-2 min-w-0 group/author cursor-pointer text-left"
          >
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover/author:scale-110 transition-transform shadow-2xs">
              <GitHubIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-background fill-background" />
            </span>
            <span className="truncate font-medium text-muted-foreground group-hover/author:text-foreground group-hover/author:underline decoration-foreground/30 underline-offset-2 transition-colors max-w-[70px] sm:max-w-[130px]">
              {authorName}
            </span>
          </button>

          <div className="flex items-center gap-1 shrink-0 font-medium text-muted-foreground">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="text-[10px] sm:text-[11px] font-mono">{starCount}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
