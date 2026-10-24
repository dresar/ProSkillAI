"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import type { Prompt, Category } from "@/db/schema";
import { formatCount, getCategoryColor } from "@/lib/format";
import { getPromptCoverImage, DEFAULT_PROMPT_COVER } from "@/lib/images";

interface PromptCardProps {
  prompt: Prompt;
  category?: Category | null;
  locale: string;
  onSelect?: (prompt: Prompt, category?: Category | null) => void;
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

export function PromptCard({ prompt, category, locale, onSelect }: PromptCardProps) {
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
  const cover = getPromptCoverImage(prompt.images);
  const demoUrl = (prompt as { demoUrl?: string | null }).demoUrl || null;
  const hasDemo = Boolean(prompt.demoOutput || prompt.demoOutputEn || demoUrl);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSelect && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelect(prompt, category);
    }
  };

  return (
    <Link
      href={`/${locale}/prompts/${prompt.slug}`}
      onClick={handleClick}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface overflow-hidden hover:border-foreground/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25 transition-colors duration-200 shadow-xs relative cursor-pointer"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
          <Image
            src={cover}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-103 transition-transform duration-300"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src !== DEFAULT_PROMPT_COVER) {
                target.src = DEFAULT_PROMPT_COVER;
              }
            }}
          />
        </div>

        <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1.5">
              <span className={`text-[11px] sm:text-xs font-medium tracking-tight truncate ${colorClass}`}>
                {categoryName}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {hasDemo && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                    Demo Output
                  </span>
                )}
                {variables.length > 0 && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                    {variables.length} vars
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xs sm:text-[14px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/90 transition-colors line-clamp-1">
              {title}
            </h3>

            <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[30px] sm:min-h-[34px]">
              {description}
            </p>
          </div>

          <div className="pt-2 sm:pt-2.5 flex items-center justify-between border-t border-border/60 text-[11px] sm:text-xs text-muted-foreground">
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

            <div className="flex items-center gap-2 shrink-0">
              {demoUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(demoUrl, "_blank", "noopener,noreferrer");
                  }}
                  title={isEn ? "Open Live Demo URL" : "Buka Link Demo"}
                  className="h-6 px-1.5 rounded-[4px] border border-border bg-muted/60 hover:bg-muted text-[10px] font-medium text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>Demo</span>
                </button>
              )}
              <div className="flex items-center gap-1 font-medium text-muted-foreground">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
                <span className="text-[10px] sm:text-[11px] font-mono">{starCount}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
