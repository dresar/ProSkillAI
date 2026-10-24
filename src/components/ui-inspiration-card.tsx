"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Check, Heart, ExternalLink, Code2 } from "lucide-react";
import type { UiInspiration } from "@/db/schema";
import { UiInspirationPreviewRenderer } from "./ui-inspiration-preview-renderer";

interface UiInspirationCardProps {
  item: UiInspiration;
  locale: string;
  onOpenQuickView?: (item: UiInspiration) => void;
}

export function UiInspirationCard({ item, locale, onOpenQuickView }: UiInspirationCardProps) {
  const isEn = locale === "en";
  const [copied, setCopied] = React.useState(false);
  const [likes, setLikes] = React.useState(item.likesCount);
  const [hasLiked, setHasLiked] = React.useState(false);

  const title = isEn ? item.titleEn : item.titleId;
  const description = isEn ? item.descriptionEn : item.descriptionId;

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.componentSnippet);
      setCopied(true);
      fetch(`/api/inspirations/${item.slug}/copy`, { method: "POST" });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    try {
      await fetch(`/api/inspirations/${item.slug}/like`, { method: "POST" });
    } catch {}
  };

  return (
    <div className="group flex flex-col justify-between rounded-[8px] border border-border/80 bg-surface p-3 sm:p-3.5 text-foreground shadow-2xs transition-all hover:border-foreground/30 hover:shadow-xs">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-border/60 bg-muted/20 flex items-center justify-center p-2.5">
          <UiInspirationPreviewRenderer slug={item.slug} className="scale-90 sm:scale-95 origin-center" />
          
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="rounded-[4px] bg-background/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground border border-border/70 backdrop-blur-xs">
              {item.category}
            </span>
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              className={`p-1.5 rounded-[5px] backdrop-blur-xs transition-colors cursor-pointer active:scale-95 ${
                hasLiked
                  ? "bg-rose-500/15 text-rose-500 border border-rose-500/30"
                  : "bg-background/80 text-muted-foreground hover:text-foreground border border-border/70"
              }`}
              title="Like pattern"
            >
              <Heart className={`w-3 h-3 ${hasLiked ? "fill-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="font-mono text-[10px]">
              {(item.tags as string[] | null)?.[0] || "Component"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {likes} {isEn ? "likes" : "suka"}
            </span>
          </div>

          <Link href={`/${locale}/inspirasi/${item.slug}`} className="block group-hover:text-cyan-500 transition-colors">
            <h3 className="text-xs sm:text-[13px] font-semibold tracking-tight text-foreground line-clamp-1">
              {title}
            </h3>
          </Link>

          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-border/60 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex h-[34px] items-center justify-center gap-1.5 rounded-[6px] border border-border bg-background px-2.5 text-[11px] font-medium text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">{isEn ? "Copied" : "Disalin"}</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-muted-foreground" />
              <span>{isEn ? "Copy Code" : "Salin Kode"}</span>
            </>
          )}
        </button>

        <Link
          href={`/${locale}/inspirasi/${item.slug}`}
          className="inline-flex h-[34px] items-center justify-center gap-1 rounded-[6px] bg-foreground px-2.5 text-[11px] font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-2xs text-center"
        >
          <span>{isEn ? "UX Guide" : "Panduan UX"}</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
