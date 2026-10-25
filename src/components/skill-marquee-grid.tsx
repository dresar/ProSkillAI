"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Play, Pause } from "lucide-react";
import type { Skill, Category } from "@/db/schema";
import { formatCount } from "@/lib/format";
import { getSkillCoverImage } from "@/lib/images";

interface SkillItemWithCategory {
  skill: Skill;
  category: Category | null;
}

interface SkillMarqueeGridProps {
  skills: SkillItemWithCategory[];
  locale: string;
}

function padRowItems(items: SkillItemWithCategory[], minCount = 8): SkillItemWithCategory[] {
  if (items.length === 0) return [];
  const result: SkillItemWithCategory[] = [];
  while (result.length < minCount) {
    for (const item of items) {
      result.push(item);
      if (result.length >= minCount) break;
    }
  }
  return result;
}

function SkillCell({
  item,
  locale,
  isEn,
  ariaHidden,
  tabIndex,
}: {
  item: SkillItemWithCategory;
  locale: string;
  isEn: boolean;
  ariaHidden?: boolean;
  tabIndex?: number;
}) {
  const { skill, category } = item;
  const title = isEn ? skill.titleEn : skill.titleId;
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : isEn
    ? "Skill"
    : "Skill";

  const fm = (skill.frontmatter as { stars?: number } | null) || null;
  const starCount = fm?.stars ? formatCount(fm.stars) : skill.copyCount > 0 ? formatCount(skill.copyCount) : "4.8k";
  const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      className="marquee-cell relative block aspect-square overflow-hidden bg-surface group rounded-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground cursor-pointer select-none"
    >
      <Image
        src={cover}
        alt=""
        fill
        sizes="(min-width: 1024px) 25vw, 50vw"
        loading="lazy"
        unoptimized
        className="object-cover rounded-none transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 pointer-events-none rounded-none" />

      <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white/90 border border-white/10 rounded-none tracking-wider font-medium">
          {categoryName}
        </span>
      </div>

      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 space-y-1 pointer-events-none">
        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300 shrink-0" aria-hidden="true" />
          <span>{starCount}</span>
        </div>
        <h3 className="text-xs sm:text-sm font-semibold text-white tracking-tight leading-snug line-clamp-2">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export function SkillMarqueeGrid({ skills, locale }: SkillMarqueeGridProps) {
  const [isPaused, setIsPaused] = React.useState(false);
  const isEn = locale === "en";

  const row0Raw: SkillItemWithCategory[] = [];
  const row1Raw: SkillItemWithCategory[] = [];
  const row2Raw: SkillItemWithCategory[] = [];

  skills.forEach((item, index) => {
    if (index % 3 === 0) row0Raw.push(item);
    else if (index % 3 === 1) row1Raw.push(item);
    else row2Raw.push(item);
  });

  const row0 = padRowItems(row0Raw.length > 0 ? row0Raw : skills, 8);
  const row1 = padRowItems(row1Raw.length > 0 ? row1Raw : skills, 8);
  const row2 = padRowItems(row2Raw.length > 0 ? row2Raw : skills, 8);

  const rows = [
    { items: row0, trackClass: "marquee-track-1" },
    { items: row1, trackClass: "marquee-track-2" },
    { items: row2, trackClass: "marquee-track-3" },
  ];

  if (!skills || skills.length === 0) return null;

  return (
    <section aria-label="Skill Marquee Stream" className="w-full relative">
      <div className="flex items-center justify-end mb-2">
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          className="inline-flex items-center gap-1.5 h-7.5 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all active:scale-95 cursor-pointer"
          aria-label={isPaused ? (isEn ? "Play marquee" : "Jalankan animasi") : (isEn ? "Pause marquee" : "Hentikan animasi")}
        >
          {isPaused ? (
            <>
              <Play className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span>{isEn ? "Play" : "Putar"}</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span>{isEn ? "Pause" : "Jeda"}</span>
            </>
          )}
        </button>
      </div>

      <div
        data-paused={isPaused}
        className="marquee-grid-wrapper w-full overflow-hidden border border-border bg-border rounded-none shadow-xs"
      >
        <div className="flex flex-col gap-px">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="marquee-row overflow-hidden">
              <div className={`marquee-track ${row.trackClass}`}>
                {row.items.map((item, idx) => (
                  <SkillCell
                    key={`orig-${rowIndex}-${idx}-${item.skill.id}`}
                    item={item}
                    locale={locale}
                    isEn={isEn}
                  />
                ))}
                {row.items.map((item, idx) => (
                  <SkillCell
                    key={`dup-${rowIndex}-${idx}-${item.skill.id}`}
                    item={item}
                    locale={locale}
                    isEn={isEn}
                    ariaHidden={true}
                    tabIndex={-1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
