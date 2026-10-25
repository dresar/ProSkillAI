"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, SlidersHorizontal, ArrowUpDown, ChevronRight, Plus, X } from "lucide-react";
import type { Skill, Category } from "@/db/schema";
import { SkillCard } from "@/components/skill-card";

interface SkillItemWithCategory {
  skill: Skill;
  category: Category | null;
}

interface SkillsMarketplaceProps {
  skills: SkillItemWithCategory[];
  categories: Category[];
  locale: string;
}

type SortOption = "most_used" | "trending" | "newest" | "highest_rated";
type QuickFilter = "all" | "free" | "github" | "verified" | "tdd";

export function SkillsMarketplace({ skills, categories, locale }: SkillsMarketplaceProps) {
  const isEn = locale === "en";

  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [quickFilter, setQuickFilter] = React.useState<QuickFilter>("all");
  const [isAiSearch, setIsAiSearch] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>("most_used");

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    skills.forEach(({ category }) => {
      const slug = category?.slug || "general";
      counts[slug] = (counts[slug] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const filteredSkills = React.useMemo(() => {
    const clean = query.trim().toLowerCase();

    let list = skills.filter(({ skill, category }) => {
      if (selectedCategory !== "all" && category?.slug !== selectedCategory) {
        return false;
      }

      if (quickFilter === "github" && skill.sourceType !== "github") {
        return false;
      }

      if (quickFilter === "tdd") {
        const text = `${skill.titleEn} ${skill.titleId} ${skill.summaryEn} ${skill.summaryId}`.toLowerCase();
        if (!text.includes("tdd") && !text.includes("test")) return false;
      }

      if (!clean) return true;

      const title = `${skill.titleEn} ${skill.titleId}`.toLowerCase();
      const summary = `${skill.summaryEn} ${skill.summaryId}`.toLowerCase();
      const author = (skill.authorName || "").toLowerCase();
      const tags = Array.isArray(skill.tags) ? (skill.tags as string[]).join(" ").toLowerCase() : "";
      const catName = category ? `${category.nameEn} ${category.nameId}`.toLowerCase() : "";

      if (isAiSearch) {
        const tokens = clean.split(/\s+/).filter((t) => t.length > 2);
        if (tokens.length === 0) return true;
        return tokens.some(
          (t) =>
            title.includes(t) ||
            summary.includes(t) ||
            author.includes(t) ||
            tags.includes(t) ||
            catName.includes(t)
        );
      }

      return (
        title.includes(clean) ||
        summary.includes(clean) ||
        author.includes(clean) ||
        tags.includes(clean) ||
        catName.includes(clean)
      );
    });

    if (isAiSearch && clean) {
      const tokens = clean.split(/\s+/).filter((t) => t.length > 2);
      list = [...list].sort((a, b) => {
        const aText = `${a.skill.titleEn} ${a.skill.titleId} ${a.skill.summaryEn} ${a.skill.summaryId}`.toLowerCase();
        const bText = `${b.skill.titleEn} ${b.skill.titleId} ${b.skill.summaryEn} ${b.skill.summaryId}`.toLowerCase();
        const aScore = tokens.reduce((acc, t) => acc + (aText.includes(t) ? 1 : 0), 0);
        const bScore = tokens.reduce((acc, t) => acc + (bText.includes(t) ? 1 : 0), 0);
        return bScore - aScore;
      });
    } else {
      list = [...list].sort((a, b) => {
        if (sortBy === "trending") {
          return (b.skill.copyCount || 0) - (a.skill.copyCount || 0);
        }
        if (sortBy === "highest_rated") {
          const aStars = (a.skill.frontmatter as { stars?: number } | null)?.stars || a.skill.copyCount || 0;
          const bStars = (b.skill.frontmatter as { stars?: number } | null)?.stars || b.skill.copyCount || 0;
          return bStars - aStars;
        }
        if (sortBy === "newest") {
          return new Date(b.skill.createdAt).getTime() - new Date(a.skill.createdAt).getTime();
        }
        return (b.skill.copyCount || 0) - (a.skill.copyCount || 0);
      });
    }

    return list;
  }, [skills, query, selectedCategory, quickFilter, isAiSearch, sortBy]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Skills</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {isEn
              ? "Free AI Agent Skills for Claude, ChatGPT, and 20+ Agents"
              : "Skill Agen AI Gratis untuk Claude, ChatGPT, dan 20+ Agent"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isEn
              ? `${skills.length}+ free skills listed today, and every one is security scanned before it appears here. Skills are structured prompt packs in the open SKILL.md format that work in Claude, Cursor, Codex, and other AI agents.`
              : `${skills.length}+ skill gratis terkurasi siap pakai hari ini, seluruhnya dipindai keamanannya sebelum terbit. Format standar SKILL.md kompatibel dengan Claude Code, Cursor, Codex, dan Antigravity.`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setQuickFilter("all");
              setQuery("");
            }}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold tracking-tight shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>{isEn ? "All skills" : "Semua skill"}</span>
          </button>

          <Link
            href={`/${locale}/skills/submit`}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] border border-foreground/20 bg-foreground text-background hover:opacity-90 text-xs font-semibold tracking-tight shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? "Request a skill" : "Ajukan skill"}</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <aside className="w-full md:w-52 lg:w-56 shrink-0 space-y-3 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-6rem)] md:overflow-y-auto pr-1">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              {isEn ? "CATEGORIES" : "KATEGORI"}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {categories.length + 1}
            </span>
          </div>

          <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-all cursor-pointer text-left shrink-0 md:shrink ${
                selectedCategory === "all"
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "bg-surface border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span>{isEn ? "All" : "Semua"}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  selectedCategory === "all"
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {skills.length}
              </span>
            </button>

            {categories.map((cat) => {
              const count = categoryCounts[cat.slug] || 0;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-xs font-medium transition-all cursor-pointer text-left shrink-0 md:shrink ${
                    isSelected
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "bg-surface border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="truncate pr-2">{isEn ? cat.nameEn : cat.nameId}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded shrink-0 ${
                      isSelected
                        ? "bg-background/20 text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 w-full space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2 rounded-xl border border-border bg-surface shadow-2xs">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    isAiSearch
                      ? isEn
                        ? "Ask AI (e.g. audit security, clean comments, design tokens)..."
                        : "Tanya AI (mis. audit keamanan, hapus komentar, token desain)..."
                      : isEn
                      ? "Search free skills, tags, creators..."
                      : "Cari skill gratis, tag, pembuat..."
                  }
                  className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                <button
                  type="button"
                  onClick={() => setIsAiSearch((prev) => !prev)}
                  role="switch"
                  aria-checked={isAiSearch}
                  className={`inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border text-xs font-medium transition-all cursor-pointer ${
                    isAiSearch
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "bg-background border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiSearch ? "fill-emerald-500 text-emerald-500" : ""}`} />
                  <span className="text-[11px] font-mono">AI search</span>
                  <span
                    className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors ${
                      isAiSearch ? "bg-emerald-500 justify-end" : "bg-muted-foreground/30 justify-start"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                  </span>
                </button>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    aria-label={isEn ? "Sort skills" : "Urutkan skill"}
                    className="h-8 pl-7 pr-6 rounded-[6px] border border-border bg-background text-foreground text-xs font-medium cursor-pointer appearance-none shadow-2xs hover:border-foreground/30 focus:outline-none"
                  >
                    <option value="most_used">{isEn ? "Most Used" : "Paling Banyak Dipakai"}</option>
                    <option value="trending">{isEn ? "Trending" : "Trending"}</option>
                    <option value="highest_rated">{isEn ? "Highest Rated" : "Rating Tertinggi"}</option>
                    <option value="newest">{isEn ? "Newest" : "Terbaru"}</option>
                  </select>
                  <ArrowUpDown className="w-3 h-3 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {(["all", "free", "github", "verified", "tdd"] as QuickFilter[]).map((filterKey) => {
                  const active = quickFilter === filterKey;
                  const label =
                    filterKey === "all"
                      ? isEn ? "All" : "Semua"
                      : filterKey === "free"
                      ? "Free"
                      : filterKey === "github"
                      ? "GitHub"
                      : filterKey === "verified"
                      ? isEn ? "Verified" : "Terverifikasi"
                      : "TDD";
                  return (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setQuickFilter(filterKey)}
                      className={`h-7 px-3 rounded-[6px] text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-foreground text-background font-semibold shadow-2xs"
                          : "bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
                {isAiSearch && (
                  <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Match</span>
                  </span>
                )}
                <span>
                  {filteredSkills.length} {isEn ? "skills found" : "skill ditemukan"}
                </span>
              </div>
            </div>
          </div>

          {filteredSkills.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-dashed border-border bg-surface text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground text-sm">
                {isEn ? "No skills found" : "Tidak ada skill ditemukan"}
              </p>
              <p>
                {isEn
                  ? "Try resetting your search query or selecting a different category."
                  : "Coba ubah kata kunci pencarian atau pilih kategori lain."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                  setQuickFilter("all");
                }}
                className="mt-2 inline-flex items-center gap-1 h-7.5 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer"
              >
                {isEn ? "Reset filters" : "Atur ulang filter"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
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
        </main>
      </div>
    </div>
  );
}
