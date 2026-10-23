"use client";

import * as React from "react";
import Link from "next/link";
import { Search, X, Star, Sparkles, Layers, ArrowRight, Check, Terminal, ExternalLink } from "lucide-react";
import { SkillCard } from "./skill-card";
import { PromptCard } from "./prompt-card";
import type { Skill, Prompt, Category } from "@/db/schema";
import { formatCount } from "@/lib/format";

interface OnePageCatalogProps {
  skills: Array<{ skill: Skill; category: Category | null }>;
  prompts: Array<{ prompt: Prompt; category: Category | null }>;
  categories: Category[];
  locale: string;
}

export function OnePageCatalog({
  skills,
  prompts,
  categories,
  locale,
}: OnePageCatalogProps) {
  const isEn = locale === "en";

  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<"all" | "skills" | "prompts">("all");
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const cleanQuery = query.trim().toLowerCase();
  const isSearchActive = cleanQuery.length >= 3;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowRecommendations(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recommendations = React.useMemo(() => {
    if (!isSearchActive) return [];

    const matchedSkills = skills
      .filter(({ skill, category }) => {
        const titleId = (skill.titleId || "").toLowerCase();
        const titleEn = (skill.titleEn || "").toLowerCase();
        const summaryId = (skill.summaryId || "").toLowerCase();
        const summaryEn = (skill.summaryEn || "").toLowerCase();
        const author = (skill.authorName || "").toLowerCase();
        const catName = category ? `${category.nameEn} ${category.nameId}`.toLowerCase() : "";
        const tags = Array.isArray(skill.tags) ? skill.tags.join(" ").toLowerCase() : "";

        return (
          titleId.includes(cleanQuery) ||
          titleEn.includes(cleanQuery) ||
          summaryId.includes(cleanQuery) ||
          summaryEn.includes(cleanQuery) ||
          author.includes(cleanQuery) ||
          catName.includes(cleanQuery) ||
          tags.includes(cleanQuery)
        );
      })
      .map(({ skill, category }) => ({
        type: "skill" as const,
        id: skill.id,
        slug: skill.slug,
        title: isEn ? skill.titleEn : skill.titleId,
        summary: isEn ? skill.summaryEn : skill.summaryId,
        category: category ? (isEn ? category.nameEn : category.nameId) : "Agent Skill",
        author: skill.authorName || (skill.sourceType === "github" ? "GitHub" : "ProSkillAI"),
        stars: (skill.frontmatter as { stars?: number } | null)?.stars || skill.copyCount,
        rank: (skill.frontmatter as { rank?: string } | null)?.rank,
        href: `/${locale}/skills/${skill.slug}`,
      }));

    const matchedPrompts = prompts
      .filter(({ prompt, category }) => {
        const titleId = (prompt.titleId || "").toLowerCase();
        const titleEn = (prompt.titleEn || "").toLowerCase();
        const descId = (prompt.descriptionId || "").toLowerCase();
        const descEn = (prompt.descriptionEn || "").toLowerCase();
        const catName = category ? `${category.nameEn} ${category.nameId}`.toLowerCase() : "";

        return (
          titleId.includes(cleanQuery) ||
          titleEn.includes(cleanQuery) ||
          descId.includes(cleanQuery) ||
          descEn.includes(cleanQuery) ||
          catName.includes(cleanQuery)
        );
      })
      .map(({ prompt, category }) => ({
        type: "prompt" as const,
        id: prompt.id,
        slug: prompt.slug,
        title: isEn ? prompt.titleEn : prompt.titleId,
        summary: isEn ? prompt.descriptionEn : prompt.descriptionId,
        category: category ? (isEn ? category.nameEn : category.nameId) : "Prompt",
        author: "ProSkillAI",
        stars: prompt.copyCount || 3200,
        rank: undefined,
        href: `/${locale}/prompts/${prompt.slug}`,
      }));

    return [...matchedSkills, ...matchedPrompts].slice(0, 6);
  }, [skills, prompts, cleanQuery, isSearchActive, isEn, locale]);

  const filteredSkills = React.useMemo(() => {
    return skills.filter(({ skill, category }) => {
      if (selectedCategory !== "all" && category?.slug !== selectedCategory) {
        return false;
      }
      if (!cleanQuery) return true;

      const titleId = (skill.titleId || "").toLowerCase();
      const titleEn = (skill.titleEn || "").toLowerCase();
      const summaryId = (skill.summaryId || "").toLowerCase();
      const summaryEn = (skill.summaryEn || "").toLowerCase();
      const author = (skill.authorName || "").toLowerCase();
      const catName = category ? `${category.nameEn} ${category.nameId}`.toLowerCase() : "";
      const tags = Array.isArray(skill.tags) ? skill.tags.join(" ").toLowerCase() : "";

      return (
        titleId.includes(cleanQuery) ||
        titleEn.includes(cleanQuery) ||
        summaryId.includes(cleanQuery) ||
        summaryEn.includes(cleanQuery) ||
        author.includes(cleanQuery) ||
        catName.includes(cleanQuery) ||
        tags.includes(cleanQuery)
      );
    });
  }, [skills, selectedCategory, cleanQuery]);

  const filteredPrompts = React.useMemo(() => {
    return prompts.filter(({ prompt, category }) => {
      if (selectedCategory !== "all" && category?.slug !== selectedCategory) {
        return false;
      }
      if (!cleanQuery) return true;

      const titleId = (prompt.titleId || "").toLowerCase();
      const titleEn = (prompt.titleEn || "").toLowerCase();
      const descId = (prompt.descriptionId || "").toLowerCase();
      const descEn = (prompt.descriptionEn || "").toLowerCase();
      const catName = category ? `${category.nameEn} ${category.nameId}`.toLowerCase() : "";

      return (
        titleId.includes(cleanQuery) ||
        titleEn.includes(cleanQuery) ||
        descId.includes(cleanQuery) ||
        descEn.includes(cleanQuery) ||
        catName.includes(cleanQuery)
      );
    });
  }, [prompts, selectedCategory, cleanQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showRecommendations || recommendations.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < recommendations.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : recommendations.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      const item = recommendations[selectedIndex];
      if (item) {
        window.location.href = item.href;
      }
    } else if (e.key === "Escape") {
      setShowRecommendations(false);
      setSelectedIndex(-1);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setShowRecommendations(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const totalResults =
    activeTab === "skills"
      ? filteredSkills.length
      : activeTab === "prompts"
      ? filteredPrompts.length
      : filteredSkills.length + filteredPrompts.length;

  return (
    <div id="catalog" className="w-full space-y-6 sm:space-y-8">
      <div className="relative max-w-3xl mx-auto space-y-3" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            id="catalog-search-input"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowRecommendations(e.target.value.trim().length >= 3);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (query.trim().length >= 3) {
                setShowRecommendations(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isEn
                ? "Type 3+ letters to search verified agent skills & prompts..."
                : "Ketik 3+ huruf untuk rekomendasi cepat skill & prompt terverifikasi..."
            }
            className="w-full h-11 pl-10 pr-24 rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground text-xs sm:text-sm shadow-xs focus:outline-2 focus:outline-foreground transition-all"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="absolute right-2.5 flex items-center gap-1.5">
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title={isEn ? "Clear search" : "Hapus pencarian"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted border border-border/70 rounded">
                /
              </kbd>
            )}
          </div>
        </div>

        {showRecommendations && recommendations.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-border bg-surface/98 backdrop-blur-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
            <div className="px-3.5 py-2 border-b border-border/80 flex items-center justify-between text-[11px] font-medium text-muted-foreground bg-muted/30">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                <span>
                  {isEn ? "Instant Recommendations" : "Rekomendasi Cepat"}
                </span>
              </span>
              <span className="font-mono text-[10px]">
                {recommendations.length} {isEn ? "matches" : "cocok"}
              </span>
            </div>

            <div className="p-1.5 divide-y divide-border/40">
              {recommendations.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    onClick={() => setShowRecommendations(false)}
                    className={`flex items-start justify-between gap-3 p-2.5 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded shrink-0 ${
                            isSelected
                              ? "bg-background/20 text-background"
                              : item.type === "skill"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {item.type}
                        </span>
                        {item.rank && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                              isSelected
                                ? "bg-background/20 text-background"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {item.rank}
                          </span>
                        )}
                        <span
                          className={`text-[11px] truncate ${
                            isSelected ? "text-background/80" : "text-muted-foreground"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-[13px] font-semibold tracking-tight truncate">
                        {item.title}
                      </h4>
                      <p
                        className={`text-[11px] line-clamp-1 mt-0.5 ${
                          isSelected ? "text-background/80" : "text-muted-foreground"
                        }`}
                      >
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                      <div
                        className={`flex items-center gap-1 text-[11px] font-mono ${
                          isSelected ? "text-background" : "text-muted-foreground"
                        }`}
                      >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{formatCount(item.stars)}</span>
                      </div>
                      <span
                        className={`text-[10px] truncate max-w-[80px] ${
                          isSelected ? "text-background/70" : "text-muted-foreground"
                        }`}
                      >
                        {item.author}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="px-3 py-1.5 border-t border-border/80 bg-muted/20 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{isEn ? "Press ↑↓ to navigate, Enter to open, Esc to dismiss" : "Gunakan ↑↓ navigasi, Enter buka, Esc tutup"}</span>
              <button
                type="button"
                onClick={() => setShowRecommendations(false)}
                className="hover:text-foreground cursor-pointer underline"
              >
                {isEn ? "Hide suggestions" : "Sembunyikan"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-1 p-0.5 rounded-[8px] bg-muted/60 border border-border/80 shrink-0 self-start">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`h-7 px-3 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isEn ? "All Catalog" : "Semua Katalog"}{" "}
            <span className="font-mono text-[10px] text-muted-foreground ml-1">
              ({filteredSkills.length + filteredPrompts.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`h-7 px-3 rounded-[6px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "skills"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{isEn ? "Agent Skills" : "Skill Agent"}</span>
            <span className="font-mono text-[10px] text-muted-foreground ml-0.5">
              ({filteredSkills.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`h-7 px-3 rounded-[6px] text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "prompts"
                ? "bg-background text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isEn ? "Prompts" : "Prompt"}</span>
            <span className="font-mono text-[10px] text-muted-foreground ml-0.5">
              ({filteredPrompts.length})
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-muted-foreground">
          <span>
            {isEn
              ? `Showing ${totalResults} verified resources`
              : `Menampilkan ${totalResults} resource terverifikasi`}
          </span>
          {(query || selectedCategory !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
              }}
              className="text-[11px] font-medium text-foreground underline hover:opacity-80 cursor-pointer"
            >
              {isEn ? "Reset filters" : "Reset filter"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`h-7 px-2.5 rounded-[6px] text-xs font-medium border transition-all whitespace-nowrap cursor-pointer shrink-0 ${
              selectedCategory === "all"
                ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                : "bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
            }`}
          >
            {isEn ? "All Topics" : "Semua Topik"}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const label = isEn ? cat.nameEn : cat.nameId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`h-7 px-2.5 rounded-[6px] text-xs font-medium border transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-foreground text-background border-foreground font-semibold shadow-2xs"
                    : "bg-surface hover:bg-muted text-muted-foreground hover:text-foreground border-border/80"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {(activeTab === "all" || activeTab === "skills") && (
        <section className="space-y-4" aria-labelledby="skills-section-heading">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-foreground" />
              <h2
                id="skills-section-heading"
                className="text-sm sm:text-base font-semibold tracking-tight text-foreground"
              >
                {isEn ? "Curated Agent Skills" : "Skill Agen AI Terkurasi"}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                {filteredSkills.length}
              </span>
            </div>
            <Link
              href={`/${locale}/skills`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <span>{isEn ? "View all skills" : "Lihat semua skill"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredSkills.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
              {isEn
                ? "No agent skills match the selected filter."
                : "Tidak ada skill agen yang cocok dengan filter."}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredSkills.map(({ skill, category }) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  category={category}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "prompts") && (
        <section className="space-y-4" aria-labelledby="prompts-section-heading">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <h2
                id="prompts-section-heading"
                className="text-sm sm:text-base font-semibold tracking-tight text-foreground"
              >
                {isEn ? "Verified Prompt Templates" : "Templat Prompt Terverifikasi"}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                {filteredPrompts.length}
              </span>
            </div>
            <Link
              href={`/${locale}/prompts`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <span>{isEn ? "View all prompts" : "Lihat semua prompt"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {filteredPrompts.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
              {isEn
                ? "No prompt templates match the selected filter."
                : "Tidak ada templat prompt yang cocok dengan filter."}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredPrompts.map(({ prompt, category }) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  category={category}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
