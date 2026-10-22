"use client";

import Link from "next/link";
import { Star, Variable } from "lucide-react";
import { motion } from "motion/react";
import type { Prompt, Category } from "@/db/schema";
import { formatCount, getCategoryColor, getAuthorInitials } from "@/lib/format";

interface PromptCardProps {
  prompt: Prompt;
  category?: Category | null;
  locale: string;
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
    ? "Prompt Library"
    : "Pustaka Prompt";

  const authorName = "ProSkillAI";
  const authorInitials = getAuthorInitials(authorName);
  const colorClass = getCategoryColor(category?.slug || categoryName);

  const variableList = Array.isArray(prompt.variables) ? prompt.variables : [];
  const starCount = prompt.copyCount > 0 ? formatCount(prompt.copyCount) : "3.2k";

  return (
    <Link
      href={`/${locale}/prompts/${prompt.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col justify-between h-full rounded-xl border border-border/80 bg-surface p-4 sm:p-5 hover:border-foreground/40 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25 transition-[border-color,box-shadow] duration-200 shadow-xs min-h-[44px]"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-xs font-medium tracking-tight ${colorClass}`}>
              {categoryName}
            </span>
            {variableList.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                <Variable className="w-2.5 h-2.5" />
                <span>{variableList.length}</span>
              </span>
            )}
          </div>

          <h3 className="text-[15px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/90 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[34px]">
            {description}
          </p>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded-full bg-muted border border-border/80 flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0 overflow-hidden">
              {authorInitials}
            </span>
            <span className="truncate font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[130px]">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 font-medium text-muted-foreground">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="text-[11px] font-mono">{starCount}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
