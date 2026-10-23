"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Copy, Check, Terminal, ShieldCheck } from "lucide-react";

interface PromptsSidebarBannerProps {
  locale: string;
}

export function PromptsSidebarBanner({ locale }: PromptsSidebarBannerProps) {
  const isEn = locale === "en";
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const featuredPrompts = [
    {
      title: isEn ? "Full-Stack Security Audit" : "Audit Keamanan Full-Stack",
      category: isEn ? "Security" : "Keamanan",
      code: "Perform deep vulnerability analysis across authentication, SQL injection, and API backdoor vectors.",
      slug: "audit-keamanan-codebase",
    },
    {
      title: isEn ? "Anti-Slop Clean Code" : "Standar Bersih Nokomen",
      category: isEn ? "Architecture" : "Arsitektur",
      code: "Enforce zero comments, self-documenting clean structure, and production-ready quality.",
      slug: "arsitektur-clean-code",
    },
    {
      title: isEn ? "OSINT Threat Intelligence" : "Protokol Intelijen OSINT",
      category: isEn ? "Recon" : "Intelijen",
      code: "Execute threat footprint analysis, DNS enumeration, and asset surface reconnaissance.",
      slug: "osint-recon-protocol",
    },
  ];

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-gradient-to-br from-surface via-surface to-muted/40 p-4 shadow-xs space-y-3.5">
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
        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
          PRO HUB
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed">
        {isEn
          ? "Equip your coding assistants with battle-tested system instructions and zero-comment architectural templates."
          : "Lengkapi agen koding Anda dengan templat sistem prompt arsitektur dan instruksi anti-slop terverifikasi."}
      </p>

      <div className="space-y-2">
        {featuredPrompts.map((p, idx) => {
          const isCopied = copiedIdx === idx;
          return (
            <div
              key={p.title}
              className="p-2.5 rounded-[8px] border border-border/70 bg-background/80 hover:bg-background transition-colors space-y-1.5 group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-foreground group-hover:text-foreground/90 transition-colors truncate">
                  {p.title}
                </span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
                  {p.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <p className="text-[10px] text-muted-foreground line-clamp-1 flex-1 font-mono">
                  {p.code}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(p.code, idx)}
                  className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                  title={isEn ? "Copy prompt snippet" : "Salin cuplikan prompt"}
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
