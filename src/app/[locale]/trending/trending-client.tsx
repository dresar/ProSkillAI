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
} from "lucide-react";
import type { TrendingRepo, TrendingTimeRange } from "@/lib/github-trending";
import { formatCompactNumber } from "@/lib/github-trending";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ShareButton } from "@/components/share";

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

export function TrendingClient({
  initialRepos,
  locale,
  isLive: initialIsLive,
}: TrendingClientProps) {
  const isEn = locale === "en";
  const [repos, setRepos] = React.useState<TrendingRepo[]>(initialRepos);
  const [selectedRange, setSelectedRange] = React.useState<TrendingTimeRange>("all");
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLive, setIsLive] = React.useState(initialIsLive);

  const [activeReadmeRepo, setActiveReadmeRepo] = React.useState<TrendingRepo | null>(null);
  const [readmeContent, setReadmeContent] = React.useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = React.useState(false);
  const [copiedClone, setCopiedClone] = React.useState(false);

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
    fetchFilteredTrending(range, selectedLanguage);
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
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
    const q = searchQuery.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );
  }, [repos, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-border bg-surface text-xs font-mono text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-foreground" />
              <span>{isEn ? "GitHub Trending 100 Index" : "Indeks GitHub Trending 100"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                {isLive ? (isEn ? "Live Synced" : "Tersinkronisasi") : "Cached Fallback"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isEn ? "Top 100 Trending GitHub Repositories" : "100 Repositori GitHub Paling Trending"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {isEn
                ? "Real-time exploration of top open source codebases, agent frameworks, and developer tooling. Inspect complete rendered READMEs and clone instructions directly."
                : "Eksplorasi repositori open-source, framework agen, dan perkakas developer terpopuler. Baca README lengkap dan salin instruksi clone secara langsung."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`h-8 px-2.5 rounded-[6px] border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
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
              className={`h-8 px-2.5 rounded-[6px] border text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
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

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search 100 repositories by name, description, topic, or language..."
                  : "Cari 100 repositori berdasarkan nama, deskripsi, topik, atau bahasa..."
              }
              className="w-full h-9 pl-9 pr-3 rounded-[6px] border border-border bg-surface text-foreground text-xs focus:outline-2 focus:outline-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {TIME_RANGES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => handleRangeChange(t.key)}
                className={`h-9 px-3 rounded-[6px] border text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium ${
                  selectedRange === t.key
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? t.labelEn : t.labelId}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
          <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Code2 className="w-3 h-3" />
            <span>{isEn ? "Language:" : "Bahasa:"}</span>
          </span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageChange(lang)}
              className={`h-7 px-2.5 rounded-[5px] border text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                selectedLanguage === lang
                  ? "border-foreground bg-foreground text-background font-semibold"
                  : "border-border/80 bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <span>
            {isEn
              ? `Displaying ${filteredRepos.length} of ${repos.length} ranked repositories`
              : `Menampilkan ${filteredRepos.length} dari ${repos.length} repositori peringkat`}
          </span>
          {isFetching && <Loader2 className="w-3 h-3 animate-spin text-foreground" />}
        </div>
        <div className="text-[11px] font-mono">
          {isEn ? "Source: GitHub Search REST v3 API" : "Sumber: GitHub Search REST v3 API"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRepos.map((repo) => (
            <div
              key={repo.id}
              className="group rounded-xl border border-border bg-surface p-4 flex flex-col justify-between hover:border-foreground/40 transition-colors shadow-2xs relative"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-muted border border-border text-foreground shrink-0">
                      #{repo.rank}
                    </span>
                    <div className="relative w-7 h-7 rounded-[5px] overflow-hidden border border-border/80 shrink-0 bg-muted">
                      <Image
                        src={repo.owner.avatarUrl}
                        alt={repo.owner.login}
                        width={28}
                        height={28}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-foreground hover:underline truncate block"
                      >
                        {repo.name}
                      </a>
                      <span className="text-[10px] text-muted-foreground truncate block font-mono">
                        {repo.owner.login}
                      </span>
                    </div>
                  </div>

                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-[4px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
                    title={isEn ? "Open in GitHub" : "Buka di GitHub"}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
                  {repo.description}
                </p>

                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded-[4px] bg-background border border-border/80 text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-border/70 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span className="truncate">{repo.language}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                      <span>{formatCompactNumber(repo.stars)}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{formatCompactNumber(repo.forks)}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenReadme(repo)}
                    className="h-7 px-1.5 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{isEn ? "README" : "README"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyClone(repo.fullName)}
                    className="h-7 px-1.5 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{isEn ? "Clone" : "Clone"}</span>
                  </button>

                  <ShareButton
                    item={{
                      type: "repo",
                      slug: repo.name,
                      title: repo.fullName,
                      description: repo.description,
                      url: repo.htmlUrl,
                      category: repo.language || "Open Source",
                      author: repo.owner.login,
                      stats: [
                        { label: "Stars", value: formatCompactNumber(repo.stars) },
                        { label: "Forks", value: formatCompactNumber(repo.forks) },
                        { label: "Rank", value: `#${repo.rank}` },
                      ],
                    }}
                    locale={locale}
                    showLabel
                    label={isEn ? "Share" : "Bagi"}
                    className="h-7 px-1.5 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground inline-flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
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
                {filteredRepos.map((repo) => (
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
                          <a
                            href={repo.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-foreground hover:underline truncate block"
                          >
                            {repo.fullName}
                          </a>
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
                        <button
                          type="button"
                          onClick={() => handleOpenReadme(repo)}
                          className="h-7 px-2 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>README</span>
                        </button>
                        <ShareButton
                          item={{
                            type: "repo",
                            slug: repo.name,
                            title: repo.fullName,
                            description: repo.description,
                            url: repo.htmlUrl,
                            category: repo.language || "Open Source",
                            author: repo.owner.login,
                            stats: [
                              { label: "Stars", value: formatCompactNumber(repo.stars) },
                              { label: "Forks", value: formatCompactNumber(repo.forks) },
                              { label: "Rank", value: `#${repo.rank}` },
                            ],
                          }}
                          locale={locale}
                          className="h-7 w-7 rounded-[5px] border border-border bg-background hover:bg-muted inline-flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                        />
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-7 w-7 rounded-[5px] border border-border bg-background hover:bg-muted inline-flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
                          title="Open on GitHub"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReadmeRepo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            className="fixed inset-0"
            onClick={() => setActiveReadmeRepo(null)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-border/80 bg-muted/30 flex items-center justify-between gap-3 shrink-0">
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
                    <span>{activeReadmeRepo.fullName}</span>
                    <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-muted border border-border/70 text-muted-foreground">
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
                <div className="prose prose-xs sm:prose-sm max-w-none dark:prose-invert">
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
