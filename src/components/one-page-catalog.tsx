"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  X,
  Star,
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  Filter,
  Terminal,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  FileCode,
} from "lucide-react";
import { SkillCard } from "./skill-card";
import { PromptCard } from "./prompt-card";
import { MarkdownRenderer } from "./markdown-renderer";
import type { Skill, Prompt, Category } from "@/db/schema";
import { formatCount } from "@/lib/format";

interface OnePageCatalogProps {
  skills: Array<{ skill: Skill; category: Category | null }>;
  prompts: Array<{ prompt: Prompt; category: Category | null }>;
  categories: Category[];
  locale: string;
  maxSkills?: number;
}

export function OnePageCatalog({
  skills,
  prompts,
  categories,
  locale,
  maxSkills,
}: OnePageCatalogProps) {
  const isEn = locale === "en";

  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [activeTab, setActiveTab] = React.useState<"all" | "skills" | "prompts">("all");
  const [showRecommendations, setShowRecommendations] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

  const [selectedSkillItem, setSelectedSkillItem] = React.useState<{ skill: Skill; category: Category | null } | null>(null);
  const [selectedPromptItem, setSelectedPromptItem] = React.useState<{ prompt: Prompt; category: Category | null } | null>(null);
  const [detailTab, setDetailTab] = React.useState<"overview" | "markdown">("overview");
  const [copiedCommand, setCopiedCommand] = React.useState(false);
  const [copiedPrompt, setCopiedPrompt] = React.useState(false);

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
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedSkillItem) setSelectedSkillItem(null);
        if (selectedPromptItem) setSelectedPromptItem(null);
      }
    };
    if (selectedSkillItem || selectedPromptItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [selectedSkillItem, selectedPromptItem]);

  const copyText = (text: string, type: "command" | "prompt") => {
    navigator.clipboard.writeText(text);
    if (type === "command") {
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } else {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const getSkillInstallCommand = (s: Skill) => {
    const fm = (s.frontmatter as { installCommand?: string } | null) || null;
    if (fm?.installCommand) return fm.installCommand;
    const author = s.authorName || (s.sourceType === "github" ? "github" : "proskillai");
    return `npx skills add ${author.toLowerCase().replace(/\s+/g, "-")}/${s.slug}`;
  };

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
        setShowRecommendations(false);
        if (item.type === "skill") {
          const found = skills.find((s) => s.skill.id === item.id);
          if (found) setSelectedSkillItem(found);
        } else {
          const found = prompts.find((p) => p.prompt.id === item.id);
          if (found) setSelectedPromptItem(found);
        }
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

  const displayedSkills = React.useMemo(() => {
    if (typeof maxSkills === "number" && maxSkills > 0 && !cleanQuery && selectedCategory === "all") {
      return filteredSkills.slice(0, maxSkills);
    }
    return filteredSkills;
  }, [filteredSkills, maxSkills, cleanQuery, selectedCategory]);

  const hasMoreSkills =
    typeof maxSkills === "number" &&
    maxSkills > 0 &&
    !cleanQuery &&
    selectedCategory === "all" &&
    filteredSkills.length > maxSkills;

  const totalResults =
    activeTab === "skills"
      ? filteredSkills.length
      : activeTab === "prompts"
      ? filteredPrompts.length
      : filteredSkills.length + filteredPrompts.length;

  return (
    <div id="catalog" className="w-full space-y-4 sm:space-y-6">
      <div className="relative max-w-2xl mx-auto space-y-2" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
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
                ? "Search skills & prompts (e.g. taste, ecc, security)..."
                : "Cari skill & prompt (mis. taste, ecc, security)..."
            }
            className="w-full h-10 pl-9 pr-20 rounded-lg border border-border bg-surface text-foreground placeholder:text-muted-foreground text-xs sm:text-sm shadow-xs focus:outline-2 focus:outline-foreground transition-all"
            autoComplete="off"
            spellCheck={false}
          />

          {query && (
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={clearSearch}
                className="w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title={isEn ? "Clear search" : "Hapus pencarian"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {showRecommendations && recommendations.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-border bg-surface/98 backdrop-blur-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-1.5 border-b border-border/80 flex items-center justify-between text-[11px] font-medium text-muted-foreground bg-muted/30">
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

            <div className="p-1 divide-y divide-border/40 max-h-[360px] overflow-y-auto">
              {recommendations.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        setShowRecommendations(false);
                        if (item.type === "skill") {
                          const found = skills.find((s) => s.skill.id === item.id);
                          if (found) setSelectedSkillItem(found);
                        } else {
                          const found = prompts.find((p) => p.prompt.id === item.id);
                          if (found) setSelectedPromptItem(found);
                        }
                      } else {
                        setShowRecommendations(false);
                      }
                    }}
                    className={`flex items-start justify-between gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-foreground text-background"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
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
                        <span
                          className={`text-[10px] truncate ${
                            isSelected ? "text-background/80" : "text-muted-foreground"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold tracking-tight truncate">
                        {item.title}
                      </h4>
                      <p
                        className={`text-[10px] line-clamp-1 mt-0.5 ${
                          isSelected ? "text-background/80" : "text-muted-foreground"
                        }`}
                      >
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0 pt-0.5">
                      <div
                        className={`flex items-center gap-1 text-[10px] font-mono ${
                          isSelected ? "text-background" : "text-muted-foreground"
                        }`}
                      >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{formatCount(item.stars)}</span>
                      </div>
                      <span
                        className={`text-[9px] truncate max-w-[70px] ${
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 rounded-xl border border-border/80 bg-surface/60 backdrop-blur-xs">
        <div className="grid grid-cols-2 gap-2 flex-1 sm:max-w-md">
          <div className="relative">
            <select
              id="catalog-type-select"
              aria-label={isEn ? "Filter by Catalog Type" : "Filter Berdasarkan Jenis Katalog"}
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as "all" | "skills" | "prompts")}
              className="w-full h-8.5 pl-8 pr-7 text-xs font-medium rounded-[6px] border border-border bg-background text-foreground appearance-none cursor-pointer hover:border-foreground/40 focus:outline-2 focus:outline-foreground transition-colors truncate shadow-2xs"
            >
              <option value="all">
                {isEn ? `All Catalog (${skills.length + prompts.length})` : `Semua Katalog (${skills.length + prompts.length})`}
              </option>
              <option value="skills">
                {isEn ? `Agent Skills (${skills.length})` : `Skill Agent (${skills.length})`}
              </option>
              <option value="prompts">
                {isEn ? `Prompts (${prompts.length})` : `Prompt (${prompts.length})`}
              </option>
            </select>
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <select
              id="catalog-topic-select"
              aria-label={isEn ? "Filter by Topic" : "Filter Berdasarkan Topik"}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-8.5 pl-8 pr-7 text-xs font-medium rounded-[6px] border border-border bg-background text-foreground appearance-none cursor-pointer hover:border-foreground/40 focus:outline-2 focus:outline-foreground transition-colors truncate shadow-2xs"
            >
              <option value="all">{isEn ? "All Topics" : "Semua Topik"}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {isEn ? cat.nameEn : cat.nameId}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-muted-foreground pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded-[4px] bg-muted/70 text-foreground border border-border/60">
            {totalResults} {isEn ? "items" : "item"}
          </span>
          {(query || selectedCategory !== "all" || activeTab !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("all");
                setActiveTab("all");
              }}
              className="text-[11px] font-medium text-foreground underline hover:opacity-80 cursor-pointer"
            >
              {isEn ? "Reset" : "Atur ulang"}
            </button>
          )}
        </div>
      </div>

      {(activeTab === "all" || activeTab === "skills") && (
        <section className="space-y-3 sm:space-y-4" aria-labelledby="skills-section-heading">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-foreground" />
              <h2
                id="skills-section-heading"
                className="text-xs sm:text-sm font-semibold tracking-tight text-foreground"
              >
                {isEn ? "Curated Agent Skills" : "Skill Agen AI Terkurasi"}
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                {displayedSkills.length}{hasMoreSkills ? ` / ${filteredSkills.length}` : ""}
              </span>
            </div>
            <Link
              href={`/${locale}/skills`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <span>{isEn ? "View all" : "Lihat semua"}</span>
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
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {displayedSkills.map(({ skill, category }) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    category={category}
                    locale={locale}
                    onSelect={(sk, cat) => setSelectedSkillItem({ skill: sk, category: cat || null })}
                  />
                ))}
              </div>

              {hasMoreSkills && (
                <div className="pt-2 flex justify-center">
                  <Link
                    href={`/${locale}/skills`}
                    className="inline-flex items-center gap-2 h-9 px-4 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all active:scale-95 cursor-pointer"
                  >
                    <span>
                      {isEn
                        ? `View all ${filteredSkills.length} skills`
                        : `Lihat semua ${filteredSkills.length} skill`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {(activeTab === "all" || activeTab === "prompts") && (
        <section className="space-y-3 sm:space-y-4" aria-labelledby="prompts-section-heading">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-foreground" />
              <h2
                id="prompts-section-heading"
                className="text-xs sm:text-sm font-semibold tracking-tight text-foreground"
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
              <span>{isEn ? "View all" : "Lihat semua"}</span>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {filteredPrompts.map(({ prompt, category }) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  category={category}
                  locale={locale}
                  onSelect={(pr, cat) => setSelectedPromptItem({ prompt: pr, category: cat || null })}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {selectedSkillItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150 cursor-pointer"
            onClick={() => setSelectedSkillItem(null)}
            aria-hidden="true"
          />
          <aside
            className="relative z-50 w-full max-w-2xl h-full bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? selectedSkillItem.skill.titleEn : selectedSkillItem.skill.titleId}
          >
            <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-3 bg-muted/20">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-foreground text-background font-semibold">
                    {selectedSkillItem.category
                      ? isEn
                        ? selectedSkillItem.category.nameEn
                        : selectedSkillItem.category.nameId
                      : "Skill"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    @{selectedSkillItem.skill.authorName || "ProSkillAI"}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                  {isEn ? selectedSkillItem.skill.titleEn : selectedSkillItem.skill.titleId}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkillItem(null)}
                className="w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
                title={isEn ? "Close (Esc)" : "Tutup (Esc)"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <div className="p-3.5 rounded-lg border border-border bg-background space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isEn ? "Install Command" : "Perintah Pasang Cepat"}</span>
                  </span>
                  <span className="font-mono text-[10px]">1-Click CLI</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded-[6px] bg-muted/40 border border-border/80 font-mono text-xs">
                  <span className="truncate select-all text-foreground">
                    {getSkillInstallCommand(selectedSkillItem.skill)}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(getSkillInstallCommand(selectedSkillItem.skill), "command")}
                    className="h-7 px-2.5 rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                  >
                    {copiedCommand ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCommand ? (isEn ? "Copied" : "Tersalin") : (isEn ? "Copy" : "Salin")}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 border-b border-border/80 pb-2">
                <button
                  type="button"
                  onClick={() => setDetailTab("overview")}
                  className={`h-7.5 px-3 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                    detailTab === "overview"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isEn ? "Overview" : "Ringkasan"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTab("markdown")}
                  className={`h-7.5 px-3 text-xs font-semibold rounded-[5px] transition-colors cursor-pointer flex items-center gap-1.5 ${
                    detailTab === "markdown"
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{isEn ? "SKILL.md (Code)" : "SKILL.md (Kode)"}</span>
                </button>
              </div>

              {detailTab === "overview" ? (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {isEn ? selectedSkillItem.skill.summaryEn : selectedSkillItem.skill.summaryId}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-border/60">
                    <span className="text-xs text-muted-foreground font-mono">
                      Stars: {selectedSkillItem.skill.copyCount || 0}
                    </span>
                    <Link
                      href={`/${locale}/skills/${selectedSkillItem.skill.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline hover:opacity-80"
                    >
                      <span>{isEn ? "Full page details" : "Lihat halaman lengkap"}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-surface p-4 text-xs">
                  <MarkdownRenderer
                    content={
                      (isEn
                        ? selectedSkillItem.skill.contentEn
                        : selectedSkillItem.skill.contentId) || ""
                    }
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {selectedPromptItem && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150 cursor-pointer"
            onClick={() => setSelectedPromptItem(null)}
            aria-hidden="true"
          />
          <aside
            className="relative z-50 w-full max-w-2xl h-full bg-surface border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? selectedPromptItem.prompt.titleEn : selectedPromptItem.prompt.titleId}
          >
            <div className="p-4 sm:p-5 border-b border-border flex items-start justify-between gap-3 bg-muted/20">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-[4px] bg-foreground text-background font-semibold">
                    {selectedPromptItem.category
                      ? isEn
                        ? selectedPromptItem.category.nameEn
                        : selectedPromptItem.category.nameId
                      : "Prompt"}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
                  {isEn ? selectedPromptItem.prompt.titleEn : selectedPromptItem.prompt.titleId}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPromptItem(null)}
                className="w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
                title={isEn ? "Close (Esc)" : "Tutup (Esc)"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isEn ? selectedPromptItem.prompt.descriptionEn : selectedPromptItem.prompt.descriptionId}
              </p>

              <div className="p-3.5 rounded-lg border border-border bg-background space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isEn ? "Prompt Text" : "Teks Prompt"}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        (isEn
                          ? selectedPromptItem.prompt.contentEn
                          : selectedPromptItem.prompt.contentId) || "",
                        "prompt"
                      )
                    }
                    className="h-7 px-2.5 rounded-[5px] bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-all shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? (isEn ? "Copied" : "Tersalin") : (isEn ? "Copy Prompt" : "Salin Prompt")}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-[6px] bg-muted/40 border border-border/80 font-mono text-xs whitespace-pre-wrap break-words text-foreground max-h-80 overflow-y-auto">
                  {(isEn
                    ? selectedPromptItem.prompt.contentEn
                    : selectedPromptItem.prompt.contentId) || ""}
                </pre>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <Link
                  href={`/${locale}/prompts/${selectedPromptItem.prompt.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground underline hover:opacity-80"
                >
                  <span>{isEn ? "Full prompt details" : "Lihat halaman lengkap"}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
