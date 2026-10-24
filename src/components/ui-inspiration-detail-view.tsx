"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Check, Heart, ArrowLeft, Monitor, Tablet, Smartphone, Sparkles, Shield, Layers, FileCode, CheckCircle2 } from "lucide-react";
import type { UiInspiration } from "@/db/schema";
import { UiInspirationPreviewRenderer } from "./ui-inspiration-preview-renderer";
import { UiInspirationCard } from "./ui-inspiration-card";

interface DetailViewProps {
  item: UiInspiration;
  relatedItems: UiInspiration[];
  locale: string;
}

export function UiInspirationDetailView({ item, relatedItems, locale }: DetailViewProps) {
  const isEn = locale === "en";
  const [viewport, setViewport] = React.useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeTab, setActiveTab] = React.useState<"react" | "tailwind" | "tokens">("react");
  const [copied, setCopied] = React.useState(false);
  const [likes, setLikes] = React.useState(item.likesCount);
  const [hasLiked, setHasLiked] = React.useState(false);

  const title = isEn ? item.titleEn : item.titleId;
  const description = isEn ? item.descriptionEn : item.descriptionId;
  const uxGuidelines = isEn ? item.uxGuidelinesEn : item.uxGuidelinesId;

  const handleCopyCode = async () => {
    try {
      const textToCopy =
        activeTab === "react"
          ? item.componentSnippet
          : activeTab === "tailwind"
          ? item.tailwindClasses || ""
          : JSON.stringify(item.designTokens, null, 2);

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      fetch(`/api/inspirations/${item.slug}/copy`, { method: "POST" });
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    try {
      await fetch(`/api/inspirations/${item.slug}/like`, { method: "POST" });
    } catch {}
  };

  const getViewportWidthClass = () => {
    if (viewport === "mobile") return "max-w-[375px]";
    if (viewport === "tablet") return "max-w-[640px]";
    return "w-full max-w-4xl";
  };

  return (
    <div className="w-full space-y-10">
      <div className="space-y-4">
        <Link
          href={`/${locale}/inspirasi`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isEn ? "Back to UI/UX Inspiration Catalog" : "Kembali ke Katalog Inspirasi UI/UX"}</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="rounded-[4px] bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {item.category}
              </span>
              <span className="text-muted-foreground text-xs">·</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {(item.tags as string[] | null)?.join(" · ")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex h-9 items-center gap-1.5 rounded-[6px] px-3.5 text-xs font-semibold transition-all cursor-pointer active:scale-95 border ${
                hasLiked
                  ? "bg-rose-500/15 text-rose-500 border-rose-500/30"
                  : "bg-surface text-muted-foreground hover:text-foreground border-border shadow-2xs"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-500" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex h-9 items-center gap-1.5 rounded-[6px] bg-foreground text-background px-4 text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? "Code Copied!" : "Kode Disalin!") : isEn ? "Copy React Code" : "Salin Kode React"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-[10px] border border-border/80 bg-surface/50 overflow-hidden shadow-2xs space-y-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/70 bg-surface">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>{isEn ? "Interactive Live Preview Sandbox" : "Pratinjau Interaktif Komponen"}</span>
          </div>

          <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-[6px] border border-border/50">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-[4px] transition-all cursor-pointer ${
                viewport === "desktop" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-[4px] transition-all cursor-pointer ${
                viewport === "tablet" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tablet View (640px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-[4px] transition-all cursor-pointer ${
                viewport === "mobile" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-12 flex items-center justify-center min-h-[300px] bg-background/50 border-b border-border/60 overflow-x-auto">
          <div className={`${getViewportWidthClass()} transition-all duration-300 flex justify-center`}>
            <UiInspirationPreviewRenderer slug={item.slug} className="w-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("react")}
                className={`h-8 px-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "react" ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                React JSX
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tailwind")}
                className={`h-8 px-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "tailwind" ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tailwind CSS
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tokens")}
                className={`h-8 px-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "tokens" ? "bg-foreground text-background shadow-2xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Design Tokens
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 text-xs font-mono font-medium text-foreground hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (isEn ? "Copied" : "Disalin") : isEn ? "Copy" : "Salin"}</span>
            </button>
          </div>

          <div className="rounded-[8px] border border-border/80 bg-[#070b13] p-4 text-zinc-300 font-mono text-xs overflow-x-auto shadow-inner min-h-[220px]">
            {activeTab === "react" && (
              <pre>
                <code>{item.componentSnippet}</code>
              </pre>
            )}
            {activeTab === "tailwind" && (
              <pre className="whitespace-pre-wrap leading-relaxed">
                <code>{item.tailwindClasses || "Standard utility classes applied."}</code>
              </pre>
            )}
            {activeTab === "tokens" && (
              <pre>
                <code>{JSON.stringify(item.designTokens, null, 2)}</code>
              </pre>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-[8px] border border-border/80 bg-surface p-4 sm:p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-border/70 text-xs font-semibold text-foreground uppercase tracking-wider">
              <Shield className="w-4 h-4 text-cyan-500" />
              <span>{isEn ? "UX Guidance & Rules" : "Panduan UX & Spesifikasi"}</span>
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line space-y-2">
              {uxGuidelines}
            </div>

            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="text-[11px] font-mono text-foreground font-semibold uppercase tracking-wider">
                {isEn ? "Design System Tokens" : "Token Desain Presisi"}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-muted-foreground">
                <div className="p-2 rounded bg-background border border-border/60">
                  <span className="text-zinc-500">Radius:</span>{" "}
                  <strong className="text-foreground">
                    {(item.designTokens as Record<string, string> | null)?.radius || "8px"}
                  </strong>
                </div>
                <div className="p-2 rounded bg-background border border-border/60">
                  <span className="text-zinc-500">Density:</span>{" "}
                  <strong className="text-foreground">Compact Non-Pill</strong>
                </div>
                <div className="p-2 rounded bg-background border border-border/60">
                  <span className="text-zinc-500">Contrast:</span>{" "}
                  <strong className="text-emerald-500">WCAG 2.2 AA</strong>
                </div>
                <div className="p-2 rounded bg-background border border-border/60">
                  <span className="text-zinc-500">Serverless:</span>{" "}
                  <strong className="text-cyan-500">Neon HTTP</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/80">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-foreground">
              {isEn ? "Related UI/UX Inspirations" : "Inspirasi UI/UX Terkait"}
            </h3>
            <Link
              href={`/${locale}/inspirasi`}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {isEn ? "View all patterns →" : "Lihat semua pola →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedItems.slice(0, 3).map((rel) => (
              <UiInspirationCard key={rel.id} item={rel} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
