"use client";

import * as React from "react";
import { Search, X, Sparkles, Filter, SlidersHorizontal, Check, Copy } from "lucide-react";
import type { UiInspiration } from "@/db/schema";
import { UiInspirationCard } from "./ui-inspiration-card";
import { UiInspirationPreviewRenderer } from "./ui-inspiration-preview-renderer";

interface UiInspirationCatalogProps {
  initialItems: UiInspiration[];
  locale: string;
}

const CATEGORIES = [
  { id: "all", nameId: "Semua", nameEn: "All Patterns" },
  { id: "cards", nameId: "Cards & Grid", nameEn: "Cards & Grid" },
  { id: "agentic", nameId: "Agentic & AI", nameEn: "Agentic & AI" },
  { id: "nav", nameId: "Navigasi", nameEn: "Navigation" },
  { id: "forms", nameId: "Form & Filter", nameEn: "Forms & Controls" },
  { id: "metrics", nameId: "Telemetri", nameEn: "Telemetry & Metrics" },
  { id: "modals", nameId: "Modal & Toast", nameEn: "Modals & Feedback" },
];

export function UiInspirationCatalog({ initialItems, locale }: UiInspirationCatalogProps) {
  const isEn = locale === "en";
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState<"newest" | "popular" | "copied">("popular");
  const [quickViewItem, setQuickViewItem] = React.useState<UiInspiration | null>(null);
  const [copiedModal, setCopiedModal] = React.useState(false);

  const filteredItems = React.useMemo(() => {
    let result = [...initialItems];

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.titleEn.toLowerCase().includes(q) ||
          item.titleId.toLowerCase().includes(q) ||
          item.descriptionEn.toLowerCase().includes(q) ||
          item.descriptionId.toLowerCase().includes(q) ||
          (item.tags as string[] | null)?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === "copied") {
      result.sort((a, b) => b.copyCount - a.copyCount);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [initialItems, selectedCategory, search, sortBy]);

  const handleCopySnippet = async (snippet: string, slug: string) => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedModal(true);
      fetch(`/api/inspirations/${slug}/copy`, { method: "POST" });
      setTimeout(() => setCopiedModal(false), 2000);
    } catch {}
  };

  return (
    <div className="w-full space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-[4px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase tracking-wider border border-cyan-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              <span>{isEn ? "100% Full Serverless Neon & Edge" : "100% Serverless Neon & Edge"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isEn ? "UI/UX Inspiration & Design Patterns" : "Inspirasi Desain UI/UX & Pola Komponen"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {isEn
                ? "Curated gallery of high-craft, compact, anti-slop interface patterns. Built with precision 8px corners, restrained padding, and accessible WCAG AA contrast."
                : "Galeri pola antarmuka modern yang tenang, presisi, dan anti-slop. Dirancang dengan sudut rounded-[8px], padding terukur, dan kontras WCAG AA."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <span className="rounded-[6px] border border-border bg-surface px-3 py-1.5 text-muted-foreground shadow-2xs">
              <strong className="text-foreground">{filteredItems.length}</strong> {isEn ? "patterns" : "komponen"}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isEn ? "Search patterns, tags, or design tokens..." : "Cari pola, tag, atau token desain..."}
              className="w-full h-9 pl-9 pr-8 rounded-[6px] border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all shadow-2xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "popular" | "copied")}
              className="h-9 rounded-[6px] border border-border bg-background px-3 text-xs text-foreground font-medium focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all shadow-2xs cursor-pointer"
            >
              <option value="popular">{isEn ? "Most Popular" : "Paling Populer"}</option>
              <option value="copied">{isEn ? "Most Copied" : "Paling Sering Disalin"}</option>
              <option value="newest">{isEn ? "Newest Patterns" : "Pola Terbaru"}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-[32px] px-3 rounded-[6px] text-xs font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? "bg-foreground text-background font-semibold shadow-2xs"
                    : "border border-border/70 bg-surface/80 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {isEn ? cat.nameEn : cat.nameId}
              </button>
            );
          })}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-[10px] border border-border/80 bg-surface p-12 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-muted/60 text-muted-foreground">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            {isEn ? "No design patterns matched your filter" : "Tidak ada pola desain yang cocok dengan pencarian"}
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {isEn
              ? "Try resetting your search query or choosing another category from the list above."
              : "Coba hapus kata kunci pencarian atau pilih kategori lain dari daftar di atas."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="inline-flex h-8 items-center justify-center rounded-[6px] border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-all"
          >
            {isEn ? "Clear all filters" : "Reset semua filter"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <UiInspirationCard
              key={item.id}
              item={item}
              locale={locale}
              onOpenQuickView={(it) => setQuickViewItem(it)}
            />
          ))}
        </div>
      )}

      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl rounded-[10px] border border-border bg-background p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">
                {isEn ? quickViewItem.titleEn : quickViewItem.titleId}
              </h3>
              <button
                type="button"
                onClick={() => setQuickViewItem(null)}
                className="p-1 rounded text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-[8px] bg-muted/30 border border-border flex items-center justify-center">
              <UiInspirationPreviewRenderer slug={quickViewItem.slug} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>React + Tailwind CSS Snippet</span>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(quickViewItem.componentSnippet, quickViewItem.slug)}
                  className="inline-flex items-center gap-1 text-foreground hover:underline font-semibold"
                >
                  {copiedModal ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedModal ? (isEn ? "Copied" : "Disalin") : isEn ? "Copy" : "Salin"}</span>
                </button>
              </div>
              <pre className="p-3 rounded-[6px] bg-black/80 text-zinc-200 font-mono text-[11px] overflow-x-auto max-h-56">
                <code>{quickViewItem.componentSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
