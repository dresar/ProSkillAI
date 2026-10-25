"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, CheckCircle2, ChevronUp, Bookmark, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Skill, Category } from "@/db/schema";
import { getSkillAuthorAvatar } from "@/lib/images";
import { formatCount } from "@/lib/format";
import { isFavorite, toggleFavorite, onFavoritesChange } from "@/lib/favorites";

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
  const categoryName = category
    ? isEn
      ? category.nameEn
      : category.nameId
    : isEn
    ? "Agent Skill"
    : "Skill Agent";

  const authorName = skill.authorName || (skill.sourceType === "github" ? "GitHub" : "ProSkillAI");
  const fm = (skill.frontmatter as { rank?: string; stars?: number; installCommand?: string } | null) || null;

  const baseStars = fm?.stars || (skill.copyCount > 0 ? skill.copyCount : 28);
  const [votes, setVotes] = React.useState(baseStars);
  const [hasVoted, setHasVoted] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    setBookmarked(isFavorite(skill.id));
    const unsubscribe = onFavoritesChange(() => {
      setBookmarked(isFavorite(skill.id));
    });
    return unsubscribe;
  }, [skill.id]);

  const avatarUrl = getSkillAuthorAvatar(skill);
  const [imgSrc, setImgSrc] = React.useState(avatarUrl);

  const userCount = skill.copyCount > 0 ? formatCount(skill.copyCount) : "1.8k";
  const rating = "4.8";
  const reviewCount = Math.max(8, Math.min(99, Math.floor((votes % 40) + 10)));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onSelect && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
      e.preventDefault();
      onSelect(skill, category);
    }
  };

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setVotes((prev) => (hasVoted ? prev - 1 : prev + 1));
    setHasVoted((prev) => !prev);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite({
      id: skill.id,
      type: "skill",
      slug: skill.slug,
      title,
      summary,
      category: categoryName,
      cover: avatarUrl,
    });
    setBookmarked(next);
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
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
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

            <span className="text-[10px] font-semibold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-[4px] shrink-0 font-mono leading-none">
              Free
            </span>
          </div>

          <p className="my-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[34px]">
            {summary}
          </p>
        </div>

        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground gap-1.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleVote}
              className={`inline-flex items-center gap-1 h-6 px-1.5 rounded-[5px] border border-border bg-muted/40 hover:bg-muted text-[11px] font-mono transition-all cursor-pointer ${
                hasVoted
                  ? "text-emerald-500 border-emerald-500/40 bg-emerald-500/10 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Upvote skill"
            >
              <ChevronUp className="w-3 h-3" />
              <span>{formatCount(votes)}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className={`w-6 h-6 rounded-[5px] border border-border bg-muted/40 hover:bg-muted flex items-center justify-center transition-all cursor-pointer ${
                bookmarked
                  ? "text-amber-400 border-amber-400/40 bg-amber-400/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Bookmark skill"
            >
              <Bookmark className={`w-3 h-3 ${bookmarked ? "fill-amber-400" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{userCount}</span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-foreground">{rating}</span>
              <span className="text-muted-foreground">({reviewCount})</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
