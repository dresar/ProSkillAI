"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import type { Skill, Category } from "@/db/schema";
import { getSkillCoverImage } from "@/lib/images";
import { formatCount, getCategoryColor, getAuthorInitials } from "@/lib/format";

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

  const starCount = skill.copyCount > 0 ? formatCount(skill.copyCount) : "4.8k";
  const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <div className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface p-4 sm:p-5 hover:border-foreground/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25 transition-all duration-200 shadow-xs min-h-[44px]">
        <div>
          {cover && (
            <div className="relative mb-3.5 aspect-video w-full overflow-hidden rounded-lg bg-muted border border-border/60">
              <Image
                src={cover}
                alt={title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-102 transition-transform duration-200"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-xs font-medium tracking-tight ${colorClass}`}>
              {categoryName}
            </span>
            {skill.sourceType === "github" && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                gh
              </span>
            )}
          </div>

          <h3 className="text-[15px] font-semibold text-foreground tracking-tight leading-snug group-hover:text-foreground/90 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[34px]">
            {summary}
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
      </div>
    </Link>
  );
}
