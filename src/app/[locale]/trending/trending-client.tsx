"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  Star,
  GitFork,
  Search,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  X,
  Loader2,
  CircleAlert,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Archive,
  ShieldCheck,
  Activity,
} from "lucide-react";
import type { TrendingRepo, TrendingTimeRange } from "@/lib/github-trending";
import { formatCompactNumber } from "@/lib/github-trending";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareButton } from "@/components/share";
import { getTrendingPreviewUrl } from "@/lib/trending-previews";

interface TrendingClientProps {
  initialRepos: TrendingRepo[];
  locale: string;
  isLive: boolean;
}

const LANGUAGES = [
  "All",
  "TypeScript",
  "Python",
  "JavaScript",
  "Rust",
  "Go",
  "C++",
  "C",
  "Zig",
  "Java",
];

const TIME_RANGES: { key: TrendingTimeRange; labelEn: string; labelId: string }[] = [
  { key: "all", labelEn: "All-Time Stars", labelId: "Bintang Sepanjang Masa" },
  { key: "daily", labelEn: "Trending Today", labelId: "Trending Hari Ini" },
  { key: "weekly", labelEn: "This Week", labelId: "Minggu Ini" },
  { key: "monthly", labelEn: "This Month", labelId: "Bulan Ini" },
];

const ITEMS_PER_PAGE = 20;

export function TrendingClient({
  initialRepos,
  locale,
  isLive: initialIsLive,
}: TrendingClientProps) {
  const isEn = locale === "en";
  const [repos, setRepos] = React.useState<TrendingRepo[]>(initialRepos);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRange, setSelectedRange] = React.useState<TrendingTimeRange>("all");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "archived">("active");
  const [archivedRepos, setArchivedRepos] = React.useState<Set<string>>(
    () => new Set(["morluto/rea", "openclaw/openclaw"])
  );
  const [isCheckingHealth, setIsCheckingHealth] = React.useState(false);
  const [healthScanDone, setHealthScanDone] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLive, setIsLive] = React.useState(initialIsLive);

  const [activeReadmeRepo, setActiveReadmeRepo] = React.useState<TrendingRepo | null>(null);
  const [readmeContent, setReadmeContent] = React.useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = React.useState(false);
  const [copiedClone, setCopiedClone] = React.useState(false);

  const isRepoArchived = React.useCallback(
    (fullName: string) => archivedRepos.has(fullName.toLowerCase()),
    [archivedRepos]
  );

  const handleRunHealthCheck = async () => {
    setIsCheckingHealth(true);
    try {
      const namesToCheck = repos.map((r) => r.fullName);
      const res = await fetch("/api/github/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: namesToCheck }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.results) {
          setArchivedRepos((prev) => {
            const next = new Set(prev);
            for (const [name, info] of Object.entries<any>(data.results)) {
              if (info.isArchived) {
                next.add(name.toLowerCase());
              }
            }
            return next;
          });
          setHealthScanDone(true);
        }
      }
    } catch {
    } finally {
      setIsCheckingHealth(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeReadmeRepo) {
        setActiveReadmeRepo(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeReadmeRepo]);

  const fetchFilteredTrending = React.useCallback(
    async (range: TrendingTimeRange, language: string) => {
      setIsFetching(true);
      try {
        const langParam = language === "All" ? "" : language;
        const res = await fetch(
          `/api/github/trending?range=${range}&language=${encodeURIComponent(langParam)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.repos)) {
            setRepos(data.repos);
            setIsLive(Boolean(data.isLive));
          }
        }
      } catch {
      } finally {
        setIsFetching(false);
      }
    },
    []
  );

  const handleRangeChange = (range: TrendingTimeRange) => {
    setSelectedRange(range);
    setCurrentPage(1);
    fetchFilteredTrending(range, selectedLanguage);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    setCurrentPage(1);
    fetchFilteredTrending(selectedRange, language);
  };

  const handleOpenReadme = async (repo: TrendingRepo) => {
    setActiveReadmeRepo(repo);
    setReadmeContent(null);
    setIsLoadingReadme(true);
    try {
      const owner = repo.owner?.login || repo.fullName.split("/")[0];
      const name = repo.name || repo.fullName.split("/")[1];
      const res = await fetch(
        `/api/github/readme?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(name)}`
      );
      if (res.ok) {
        const data = await res.json();
        setReadmeContent(data.markdown || "");
      } else {
        setReadmeContent(
          `# ${repo.fullName}\n\nUnable to fetch README directly from GitHub API. Visit the repository: [${repo.htmlUrl}](${repo.htmlUrl})`
        );
      }
    } catch {
      setReadmeContent(
        `# ${repo.fullName}\n\nFailed to load README. Visit [${repo.htmlUrl}](${repo.htmlUrl}) directly.`
      );
    } finally {
      setIsLoadingReadme(false);
    }
  };

  const handleCopyClone = (fullName: string) => {
    navigator.clipboard.writeText(`git clone https://github.com/${fullName}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  const filteredRepos = React.useMemo(() => {
    let list = repos;

    if (statusFilter === "active") {
      list = list.filter((r) => !archivedRepos.has(r.fullName.toLowerCase()));
    } else if (statusFilter === "archived") {
      list = list.filter((r) => archivedRepos.has(r.fullName.toLowerCase()));
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );
  }, [repos, searchQuery, statusFilter, archivedRepos]);

  const totalPages = Math.ceil(filteredRepos.length / ITEMS_PER_PAGE) || 1;
  const paginatedRepos = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRepos.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRepos, currentPage]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {isEn ? "Top 100 Trending GitHub Repositories" : "100 Repositori GitHub Trending"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isEn
                ? "Explore top open source codebases and developer tooling."
                : "Eksplorasi repositori open-source dan perkakas developer terpopuler."}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`h-7 px-2.5 rounded-[5px] border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`h-7 px-2.5 rounded-[5px] border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Table view"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isEn ? "Search repositories..." : "Cari repositori..."}
              className="w-full h-8 sm:h-9 pl-9 pr-3 rounded-[6px] border border-border bg-surface text-foreground text-xs focus:outline-2 focus:outline-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
            {TIME_RANGES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => handleRangeChange(t.key)}
                className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-[6px] border text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium ${
                  selectedRange === t.key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? t.labelEn : t.labelId}
              </button>
            ))}

            <div className="relative inline-flex items-center shrink-0">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                aria-label={isEn ? "Language" : "Bahasa"}
                className="h-8 sm:h-9 pl-2.5 pr-7 rounded-[6px] border border-border bg-surface text-xs font-medium text-foreground appearance-none cursor-pointer hover:border-foreground/40 transition-colors focus:outline-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "All" ? (isEn ? "All Languages" : "Semua Bahasa") : lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-border/60">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-foreground text-background font-semibold shadow-2xs"
                : "border border-border/80 bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            {isEn ? "All" : "Semua"} ({repos.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("active");
              setCurrentPage(1);
            }}
            className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-all cursor-pointer ${
              statusFilter === "active"
                ? "bg-foreground text-background font-semibold shadow-2xs"
                : "border border-border/80 bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
            {isEn ? "Active" : "Aktif"} ({repos.filter((r) => !isRepoArchived(r.fullName)).length})
          </button>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("archived");
              setCurrentPage(1);
            }}
            className={`h-7 px-2.5 rounded-[5px] text-[11px] font-medium transition-all cursor-pointer ${
              statusFilter === "archived"
                ? "bg-foreground text-background font-semibold shadow-2xs"
                : "border border-border/80 bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            <Archive className="w-3 h-3 text-amber-500 mr-1.5 inline-block" />
            {isEn ? "Archived" : "Diarsipkan"} ({repos.filter((r) => isRepoArchived(r.fullName)).length})
          </button>
        </div>
      </div>

      {filteredRepos.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-2">
          <CircleAlert className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">
            {isEn ? "No repositories match your filter" : "Tidak ada repositori yang sesuai filter"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isEn ? "Try adjusting your search query or language filter." : "Coba ubah kata kunci pencarian atau bahasa."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {paginatedRepos.map((repo) => {
            const isArchived = isRepoArchived(repo.fullName);
            return (
              <div
                key={repo.id}
                className={`group rounded-xl border bg-surface overflow-hidden flex flex-col justify-between hover:border-foreground/40 transition-all shadow-2xs relative ${
                  isArchived ? "border-amber-500/40 bg-surface/80" : "border-border"
                }`}
              >
                <div>
                  <Link
                    href={`/${locale}/trending/${repo.owner.login}/${repo.name}`}
                    className="block relative aspect-[16/9] w-full overflow-hidden bg-[#070a14] group/cover border-b border-border/80"
                  >
                    <Image
                      src={getTrendingPreviewUrl(repo.fullName)}
                      alt={repo.fullName}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover/cover:scale-103 transition-transform duration-300"
                      unoptimized
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const fallbackUrl = `https://opengraph.githubassets.com/1/${repo.fullName}`;
                        if (target.src !== fallbackUrl) {
                          target.src = fallbackUrl;
                        }
                      }}
                    />
                  </Link>

                  <div className="p-2.5 sm:p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-muted border border-border text-foreground shrink-0">
                          #{repo.rank}
                        </span>
                        <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-[4px] overflow-hidden border border-border/80 shrink-0 bg-muted">
                          <Image
                            src={repo.owner.avatarUrl}
                            alt={repo.owner.login}
                            width={24}
                            height={24}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/${locale}/trending/${repo.owner.login}/${repo.name}`}
                            className="text-xs font-semibold text-foreground hover:underline truncate block"
                          >
                            {repo.name}
                          </Link>
                          <span className="text-[10px] text-muted-foreground truncate block font-mono">
                            {repo.owner.login}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2rem]">
                      {repo.description}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 sm:p-3.5 pt-0 space-y-2">
                  <div className="pt-2 border-t border-border/70 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        <span className="truncate text-[10px] sm:text-[11px]">{repo.language}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px]">
                        <span className="inline-flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 fill-amber-400" />
                          <span>{formatCompactNumber(repo.stars)}</span>
                        </span>
                        <span className="inline-flex items-center gap-0.5">
                          <GitFork className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          <span>{formatCompactNumber(repo.forks)}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <Link
                        href={`/${locale}/trending/${repo.owner.login}/${repo.name}`}
                        className="h-7 px-2 rounded-[5px] border border-foreground bg-foreground text-background text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{isEn ? "Detail" : "Detail"}</span>
                      </Link>

                      <ShareButton
                        item={{
                          type: "repo",
                          slug: repo.name,
                          title: repo.fullName,
                          description: repo.description,
                          url: repo.htmlUrl,
                          category: repo.language || "Open Source",
                          author: repo.owner.login,
                          cover: getTrendingPreviewUrl(repo.fullName),
                          stats: [
                            { label: "Stars", value: formatCompactNumber(repo.stars) },
                            { label: "Forks", value: formatCompactNumber(repo.forks) },
                            { label: "Rank", value: `#${repo.rank}` },
                          ],
                        }}
                        locale={locale}
                        showLabel
                        label={isEn ? "Share" : "Bagi"}
                        className="h-7 px-2 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/40 font-mono text-[11px] text-muted-foreground">
                  <th className="py-2.5 px-3 w-14">#</th>
                  <th className="py-2.5 px-3">{isEn ? "Repository" : "Repositori"}</th>
                  <th className="py-2.5 px-3">{isEn ? "Language" : "Bahasa"}</th>
                  <th className="py-2.5 px-3 text-right">{isEn ? "Stars" : "Bintang"}</th>
                  <th className="py-2.5 px-3 text-right">{isEn ? "Forks" : "Fork"}</th>
                  <th className="py-2.5 px-3 text-center">{isEn ? "Actions" : "Aksi"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedRepos.map((repo) => (
                  <tr key={repo.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-muted-foreground">
                      #{repo.rank}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5 min-w-[200px]">
                        <div className="relative w-6 h-6 rounded-[4px] overflow-hidden border border-border/80 shrink-0 bg-muted">
                          <Image
                            src={repo.owner.avatarUrl}
                            alt={repo.owner.login}
                            width={24}
                            height={24}
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/${locale}/trending/${repo.owner.login}/${repo.name}`}
                            className="font-semibold text-foreground hover:underline truncate block"
                          >
                            {repo.fullName}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate max-w-md">
                            {repo.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: repo.languageColor }}
                        />
                        <span className="text-[11px]">{repo.language}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold whitespace-nowrap">
                      {formatCompactNumber(repo.stars)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-muted-foreground whitespace-nowrap">
                      {formatCompactNumber(repo.forks)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/${locale}/trending/${repo.owner.login}/${repo.name}`}
                          className="h-7 px-2.5 rounded-[5px] border border-foreground bg-foreground text-background text-[11px] font-semibold inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{isEn ? "Detail" : "Detail"}</span>
                        </Link>
                        <ShareButton
                          item={{
                            type: "repo",
                            slug: repo.name,
                            title: repo.fullName,
                            description: repo.description,
                            url: repo.htmlUrl,
                            category: repo.language || "Open Source",
                            author: repo.owner.login,
                            cover: `https://opengraph.githubassets.com/1/${repo.fullName}`,
                            stats: [
                              { label: "Stars", value: formatCompactNumber(repo.stars) },
                              { label: "Forks", value: formatCompactNumber(repo.forks) },
                              { label: "Rank", value: `#${repo.rank}` },
                            ],
                          }}
                          locale={locale}
                          showLabel
                          label={isEn ? "Share" : "Bagi"}
                          className="h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted inline-flex items-center justify-center gap-1 transition-colors text-[11px] font-medium text-foreground cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground order-2 sm:order-1 font-mono">
            {isEn
              ? `Page ${currentPage} of ${totalPages} (${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredRepos.length)} of ${filteredRepos.length})`
              : `Halaman ${currentPage} dari ${totalPages} (${(currentPage - 1) * ITEMS_PER_PAGE + 1} - ${Math.min(currentPage * ITEMS_PER_PAGE, filteredRepos.length)} dari ${filteredRepos.length})`}
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{isEn ? "Prev" : "Sebelumnya"}</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | string)[]>((acc, p, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`dots-${idx}`} className="px-1 text-xs text-muted-foreground font-mono">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === currentPage;
                  return (
                    <button
                      key={`page-${p}`}
                      type="button"
                      onClick={() => {
                        setCurrentPage(Number(p));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`h-8 min-w-[32px] px-2 rounded-[6px] text-xs font-mono font-medium transition-colors cursor-pointer border ${
                        isCurrent
                          ? "border-foreground bg-foreground text-background font-semibold"
                          : "border-border bg-surface text-foreground hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
            </div>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs font-medium text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <span>{isEn ? "Next" : "Berikutnya"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {activeReadmeRepo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            className="fixed inset-0"
            onClick={() => setActiveReadmeRepo(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden z-10 my-auto animate-in zoom-in-95 duration-150">
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-border bg-muted/40 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-8 h-8 rounded-[6px] overflow-hidden border border-border shrink-0 bg-muted">
                  <Image
                    src={activeReadmeRepo.owner.avatarUrl}
                    alt={activeReadmeRepo.owner.login}
                    width={32}
                    height={32}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-foreground truncate flex items-center gap-2">
                    <span className="truncate">{activeReadmeRepo.fullName}</span>
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-muted border border-border/70 text-foreground shrink-0">
                      #{activeReadmeRepo.rank}
                    </span>
                  </h2>
                  <p className="text-[11px] text-muted-foreground truncate font-mono">
                    {formatCompactNumber(activeReadmeRepo.stars)} stars · {formatCompactNumber(activeReadmeRepo.forks)} forks · {activeReadmeRepo.license}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopyClone(activeReadmeRepo.fullName)}
                  className="h-8 px-2.5 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedClone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-semibold">{isEn ? "Copied" : "Disalin"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isEn ? "git clone" : "Salin clone"}</span>
                    </>
                  )}
                </button>

                <a
                  href={activeReadmeRepo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-2.5 rounded-[6px] bg-foreground text-background text-xs font-semibold inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>

                <ShareButton
                  item={{
                    type: "repo",
                    slug: activeReadmeRepo.name,
                    title: activeReadmeRepo.fullName,
                    description: activeReadmeRepo.description,
                    url: activeReadmeRepo.htmlUrl,
                    category: activeReadmeRepo.language || "Open Source",
                    author: activeReadmeRepo.owner.login,
                    cover: `https://opengraph.githubassets.com/1/${activeReadmeRepo.fullName}`,
                    stats: [
                      { label: "Stars", value: formatCompactNumber(activeReadmeRepo.stars) },
                      { label: "Forks", value: formatCompactNumber(activeReadmeRepo.forks) },
                      { label: "Rank", value: `#${activeReadmeRepo.rank}` },
                    ],
                  }}
                  locale={locale}
                  className="w-8 h-8 rounded-[6px] border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => setActiveReadmeRepo(null)}
                  className="w-8 h-8 rounded-[6px] border border-border hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close README viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-background">
              {isLoadingReadme ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin text-foreground" />
                  <span className="text-xs">{isEn ? "Fetching raw README from GitHub..." : "Mengambil README dari GitHub..."}</span>
                </div>
              ) : readmeContent ? (
                <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none text-foreground break-words leading-relaxed">
                  <MarkdownRenderer content={readmeContent} />
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  {isEn ? "No README content found." : "Konten README tidak ditemukan."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
