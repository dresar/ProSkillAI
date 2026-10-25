"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import type { Skill, Category } from "@/db/schema";
import { getSkillAuthorAvatar } from "@/lib/images";
import { formatCount } from "@/lib/format";
import { ShareButton } from "@/components/share/share-button";

interface SkillCardProps {
  skill: Skill;
  category?: Category | null;
  locale: string;
  onSelect?: (skill: Skill, category?: Category | null) => void;
}

export function SkillCard({ skill, category, locale, onSelect }: SkillCardProps) {
  const isEn = locale === "en";
  const title = isEn ? skill.titleEn : skill.titleId;
  const summary = isEn ? skill.summaryEn : skill.summaryId;

  const authorName = skill.authorName || (skill.sourceType === "github" ? "GitHub" : "ProSkillAI");
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : "Skill";
  const fm = (skill.frontmatter as { stars?: number } | null) || null;

  const rawStars = fm?.stars || skill.copyCount || 0;
  const starCount = rawStars > 0 ? formatCount(rawStars) : "4.8k";

  const avatarUrl = getSkillAuthorAvatar(skill);
  const [imgSrc, setImgSrc] = React.useState(avatarUrl);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSelect && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelect(skill, category);
    }
  };

  return (
    <Link
      href={`/${locale}/skills/${skill.slug}`}
      onClick={handleClick}
      className="group block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground rounded-xl"
    >
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="flex flex-col justify-between h-full rounded-xl border border-border bg-surface p-3.5 sm:p-4 hover:border-foreground/30 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200 shadow-2xs cursor-pointer select-none"
      >
        <div>
          <div className="flex items-start gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-[8px] overflow-hidden bg-muted border border-border/80 shrink-0 flex items-center justify-center shadow-2xs group-hover:border-foreground/30 transition-colors">
              <Image
                src={imgSrc}
                alt={authorName}
                fill
                unoptimized
                sizes="40px"
                className="object-cover"
                onError={() => {
                  setImgSrc("https://github.com/dresar.png");
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <h3
                  title={title}
                  className="text-xs sm:text-[13px] font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-foreground/90 transition-colors"
                >
                  {title}
                </h3>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-label="Verified Skill" />
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                by <span className="hover:underline">{authorName}</span>
              </p>
            </div>
          </div>

          <p className="my-3 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[34px]">
            {summary}
          </p>
        </div>

        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
          <ShareButton
            item={{
              type: "skill",
              title,
              description: summary,
              url: `/${locale}/skills/${skill.slug}`,
              category: categoryName,
              author: authorName,
              slug: skill.slug,
              badge: "Verified Skill",
              stats: [{ label: "Stars", value: starCount }],
              cover: avatarUrl,
            }}
            locale={locale}
            showLabel={true}
            label={isEn ? "Share" : "Bagikan"}
            className="h-6.5 px-2.5 rounded-[5px] border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-medium"
          />

          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-medium">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="text-foreground">{starCount}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
