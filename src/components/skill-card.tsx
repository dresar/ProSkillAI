"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Skill, Category } from "@/db/schema";
import { getSkillCoverImage } from "@/lib/images";
import { formatCount, getCategoryColor, getAuthorInitials } from "@/lib/format";
import { FavoriteButton } from "@/components/favorite-button";

interface SkillCardProps {
  skill: Skill;
  category?: Category | null;
  locale: string;
}

export function SkillCard({ skill, category, locale }: SkillCardProps) {
  const isEn = locale === "en";
  const title = isEn ? skill.titleEn : skill.titleId;
  const summary = isEn ? skill.summaryEn : skill.summaryId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : isEn
    ? "Agent Skill"
    : "Skill Agent";

  const authorName = skill.authorName || (skill.sourceType === "github" ? "GitHub" : "ProSkillAI");
  const authorInitials = getAuthorInitials(authorName);
  const colorClass = getCategoryColor(category?.slug || categoryName);

  const fm = (skill.frontmatter as { rank?: string; stars?: number; installCommand?: string } | null) || null;
  const starCount = fm?.stars ? formatCount(fm.stars) : skill.copyCount > 0 ? formatCount(skill.copyCount) : "4.8k";
  const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <div className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface overflow-hidden hover:border-foreground/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25 transition-all duration-200 shadow-xs">
        {cover && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border">
            <Image
              src={cover}
              alt={title}
              fill
              unoptimized
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2 z-10">
              <FavoriteButton
                item={{
                  id: skill.id,
                  type: "skill",
                  slug: skill.slug,
                  title,
                  summary,
                  category: categoryName,
                  cover,
                }}
                className="w-7 h-7 rounded-[6px] bg-background/80 backdrop-blur-xs border border-border/80 flex items-center justify-center hover:bg-background transition-all shadow-2xs"
              />
            </div>
          </div>
        )}

        <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2">
              <span className={`text-[11px] sm:text-xs font-medium tracking-tight truncate ${colorClass}`}>
                {categoryName}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                {fm?.rank && (
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0 font-semibold">
                    {fm.rank}
                  </span>
                )}
                {skill.sourceType === "github" && (
                  <span className="text-[9px] sm:text-[10px] uppercase font-mono px-1 sm:px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                    gh
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xs sm:text-[14px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/90 transition-colors line-clamp-1">
              {title}
            </h3>

            <p className="mt-1 sm:mt-1.5 text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[30px] sm:min-h-[34px]">
              {summary}
            </p>
          </div>

          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 flex items-center justify-between border-t border-border/60 text-[11px] sm:text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-muted border border-border/80 flex items-center justify-center text-[9px] sm:text-[10px] font-semibold text-foreground shrink-0 overflow-hidden">
                {authorInitials}
              </span>
              <span className="truncate font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[70px] sm:max-w-[130px]">
                {authorName}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 font-medium text-muted-foreground">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
              <span className="text-[10px] sm:text-[11px] font-mono">{starCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
