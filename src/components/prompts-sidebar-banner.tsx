"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Copy, Check, FileCode2 } from "lucide-react";
import type { Prompt, Category } from "@/db/schema";

interface PromptsSidebarBannerProps {
  locale: string;
  prompts?: Array<{ prompt: Prompt; category: Category | null }>;
}

export function PromptsSidebarBanner({ locale, prompts = [] }: PromptsSidebarBannerProps) {
  const isEn = locale === "en";
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-gradient-to-br from-surface via-surface to-muted/30 p-4 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[5px] bg-foreground text-background flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight">
              {isEn ? "Engineering Prompts" : "Pustaka Prompt AI"}
            </h3>
            <span className="text-[10px] text-muted-foreground block -mt-0.5">
              {isEn ? "Verified Agent Instructions" : "Instruksi Agen Terverifikasi"}
            </span>
          </div>
        </div>

        <Link
          href={`/${locale}/prompts`}
          className="text-[10px] font-mono text-muted-foreground hover:text-foreground inline-flex items-center gap-0.5 transition-colors"
        >
          <span>{isEn ? "All" : "Semua"}</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {isEn
          ? "Equip your coding assistants with battle-tested system instructions and zero-comment architectural templates."
          : "Lengkapi agen koding Anda dengan templat sistem prompt arsitektur dan instruksi anti-slop terverifikasi."}
      </p>

      {prompts.length > 0 ? (
        <div className="space-y-2">
          {prompts.map(({ prompt: p, category }, idx) => {
            const isCopied = copiedIdx === idx;
            const title = isEn ? p.titleEn : p.titleId;
            const desc = isEn ? p.descriptionEn : p.descriptionId;
            const content = isEn ? p.contentEn : p.contentId;
            const catName = category ? (isEn ? category.nameEn : category.nameId) : null;

            return (
              <div
                key={p.id}
                className="p-2.5 rounded-[8px] border border-border/70 bg-background/80 hover:bg-background transition-colors space-y-1.5 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/${locale}/prompts/${p.slug}`}
                    className="text-[11px] font-semibold text-foreground hover:underline decoration-foreground/40 underline-offset-2 truncate"
                  >
                    {title}
                  </Link>
                  {catName && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                      {catName}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p className="text-[10px] text-muted-foreground line-clamp-1 flex-1 font-mono">
                    {desc || content.slice(0, 100)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(content, idx)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                    title={isEn ? "Copy prompt" : "Salin prompt"}
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-border/60 bg-background/60 text-center space-y-1">
          <FileCode2 className="w-4 h-4 mx-auto text-muted-foreground" />
          <p className="text-[11px] text-muted-foreground">
            {isEn ? "Explore curated prompt engineering collection." : "Jelajahi koleksi prompt engineering terverifikasi."}
          </p>
        </div>
      )}

      <Link
        href={`/${locale}/prompts`}
        className="w-full inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[6px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all active:scale-95 shadow-xs"
      >
        <span>{isEn ? "Explore All Prompts" : "Jelajahi Pustaka Prompt"}</span>
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
