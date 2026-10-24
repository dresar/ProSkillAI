"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Boxes,
  Layers,
  Search,
  Check,
  ChevronDown,
  ExternalLink,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Eye,
  MessageSquare,
  FileSearch,
  Sparkles,
  Terminal,
} from "lucide-react";
import type { McpServerItem, McpCategoryKey } from "@/data/mcp-catalog";
import { MCP_CATEGORIES, MCP_CATALOG_STATS } from "@/data/mcp-catalog";
import { formatCompactNumber } from "@/lib/github-trending";
import { ShareButton } from "@/components/share";

interface McpClientProps {
  servers: McpServerItem[];
  locale: string;
}

const CATEGORY_ICONS: Record<McpCategoryKey, React.ComponentType<{ className?: string }>> = {
  frameworks: Layers,
  sandboxes: Cpu,
  observability: Eye,
  memory: Sparkles,
  "dev-tools": Terminal,
  databases: Database,
  browsing: Globe,
  filesystem: HardDrive,
  "ai-gateways": Boxes,
  collaboration: MessageSquare,
  search: FileSearch,
};

export function McpClient({ servers, locale }: McpClientProps) {
  const isEn = locale === "en";
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [filterType, setFilterType] = React.useState<"all" | "open-source" | "self-hostable">("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState(false);
  const categoryDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of servers) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [servers]);

  const selectedCategoryObj = MCP_CATEGORIES.find((c) => c.key === selectedCategory);
  const SelectedCatIcon =
    selectedCategory === "all"
      ? Layers
      : CATEGORY_ICONS[selectedCategory as McpCategoryKey] || Layers;
  const selectedCategoryCount =
    selectedCategory === "all"
      ? servers.length
      : categoryCounts[selectedCategory] || 0;
  const selectedCategoryLabel =
    selectedCategory === "all"
      ? (isEn ? "All Categories" : "Semua Kategori")
      : (selectedCategoryObj?.label || selectedCategory);

  const filteredServers = React.useMemo(() => {
    return servers.filter((s) => {
      if (selectedCategory !== "all" && s.category !== selectedCategory) {
        return false;
      }
      if (filterType === "open-source" && !s.isOpenSource) {
        return false;
      }
      if (filterType === "self-hostable" && !s.isSelfHostable) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesVendor = s.vendor.toLowerCase().includes(q);
        const matchesDesc = s.description.toLowerCase().includes(q);
        const matchesTools = s.tools.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesVendor && !matchesDesc && !matchesTools) {
          return false;
        }
      }
      return true;
    });
  }, [servers, selectedCategory, filterType, searchQuery]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] border border-border bg-surface text-xs font-mono text-muted-foreground">
          <Boxes className="w-3.5 h-3.5 text-foreground" />
          <span>{MCP_CATALOG_STATS.heroTitle}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {isEn ? "139 MCP Servers, One Directory" : "139 MCP Server dalam Satu Direktori"}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {MCP_CATALOG_STATS.heroSubtitle}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              {isEn ? "Tools Indexed" : "Perkakas Terindeks"}
            </span>
            <span className="text-2xl font-bold font-mono text-foreground">
              {MCP_CATALOG_STATS.totalServers}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              {isEn ? "Categories" : "Kategori"}
            </span>
            <span className="text-2xl font-bold font-mono text-foreground">
              {MCP_CATALOG_STATS.totalCategories}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              {isEn ? "Open Source" : "Sumber Terbuka"}
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {MCP_CATALOG_STATS.openSourceCount}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-surface shadow-2xs space-y-1">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              {isEn ? "Self-Hostable" : "Dapat Di-host Sendiri"}
            </span>
            <span className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {MCP_CATALOG_STATS.selfHostableCount}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 p-2 rounded-xl border border-border/80 bg-surface/60 backdrop-blur-xs">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isEn
                  ? "Search 139 MCP servers by name, vendor, tool capability, or description..."
                  : "Cari 139 server MCP berdasarkan nama, pembuat, kapabilitas tool, atau deskripsi..."
              }
              className="w-full h-8.5 pl-8.5 pr-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-2 focus:outline-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:flex-initial" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="w-full sm:w-auto h-8.5 px-3 rounded-[6px] border border-border bg-background hover:bg-muted text-foreground text-xs font-medium inline-flex items-center justify-between sm:justify-start gap-2 cursor-pointer transition-colors shadow-2xs"
                aria-expanded={categoryDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-2 truncate">
                  <SelectedCatIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[200px] font-semibold">
                    {selectedCategoryLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded-[4px] border border-border/60">
                    {selectedCategoryCount}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {categoryDropdownOpen && (
                <div className="absolute right-0 sm:right-auto sm:left-0 z-40 mt-1.5 w-72 sm:w-80 rounded-xl border border-border bg-surface/98 backdrop-blur-md p-1.5 shadow-xl space-y-0.5 max-h-84 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-muted text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-foreground" />
                      <span>{isEn ? "All Categories" : "Semua Kategori"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-[4px] border border-border/50">
                        {servers.length}
                      </span>
                      {selectedCategory === "all" && <Check className="w-3.5 h-3.5 text-foreground" />}
                    </div>
                  </button>

                  <div className="h-px bg-border/60 my-1" />

                  {MCP_CATEGORIES.map((cat) => {
                    const IconComponent = CATEGORY_ICONS[cat.key] || Layers;
                    const count = categoryCounts[cat.key] || 0;
                    const isSelected = selectedCategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setCategoryDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <IconComponent className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded-[4px] border border-border/50">
                            {count}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-foreground shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`h-8.5 px-2.5 sm:px-3 rounded-[6px] border text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "all"
                    ? "border-foreground bg-foreground text-background font-semibold"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "All" : "Semua"} ({servers.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("open-source")}
                className={`h-8.5 px-2.5 sm:px-3 rounded-[6px] border text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "open-source"
                    ? "border-emerald-500 bg-emerald-500 text-white font-semibold"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "Open Source" : "Sumber Terbuka"} ({MCP_CATALOG_STATS.openSourceCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("self-hostable")}
                className={`h-8.5 px-2.5 sm:px-3 rounded-[6px] border text-xs font-medium transition-colors cursor-pointer ${
                  filterType === "self-hostable"
                    ? "border-cyan-500 bg-cyan-500 text-white font-semibold"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {isEn ? "Self-Hostable" : "Self-Hostable"} ({MCP_CATALOG_STATS.selfHostableCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/70 pb-3">
        <span>
          {isEn
            ? `Showing ${filteredServers.length} of ${servers.length} MCP stack modules`
            : `Menampilkan ${filteredServers.length} dari ${servers.length} modul stack MCP`}
        </span>
        <span className="font-mono text-[11px]">
          {isEn ? "Anthropic MCP Specification 1.0" : "Spesifikasi Anthropic MCP 1.0"}
        </span>
      </div>

      {filteredServers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl space-y-2">
          <Boxes className="w-6 h-6 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">
            {isEn ? "No MCP servers match your criteria" : "Tidak ada server MCP yang sesuai filter"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isEn ? "Try adjusting your search query or category." : "Coba ubah kata kunci atau kategori pencarian."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredServers.map((server) => {
            const IconComponent = CATEGORY_ICONS[server.category] || Layers;
            return (
              <div
                key={server.id}
                className="group rounded-xl border border-border bg-surface p-3.5 flex flex-col justify-between hover:border-foreground/40 transition-colors shadow-2xs space-y-3"
              >
                <div className="space-y-2.5">
                  <Link
                    href={`/${locale}/mcp/${server.slug}`}
                    className="block relative aspect-video w-full rounded-lg overflow-hidden border border-border/70 bg-muted/30 group/cover hover:opacity-95 transition-opacity"
                  >
                    <Image
                      src={`/images/mcp/${server.category}.svg`}
                      alt={server.categoryLabel}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover/cover:scale-102 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-[5px] bg-foreground text-background flex items-center justify-center shrink-0">
                        <IconComponent className="w-3.5 h-3.5 text-background" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/${locale}/mcp/${server.slug}`}
                          className="text-xs font-semibold text-foreground hover:underline truncate block"
                        >
                          {server.name}
                        </Link>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">
                          {server.vendor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {server.isOpenSource && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                          OSS
                        </span>
                      )}
                      {server.isSelfHostable && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-[4px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-semibold">
                          Self-Host
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
                    {server.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border/70 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="text-[10px] font-mono truncate max-w-[130px]">
                      {server.categoryLabel}
                    </span>
                    <span className="font-mono text-[10px]">
                      {formatCompactNumber(server.stars)} stars
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                    <Link
                      href={`/${locale}/mcp/${server.slug}`}
                      className="h-7 px-2 rounded-[5px] border border-foreground bg-foreground text-background text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>{isEn ? "Detail" : "Detail"}</span>
                    </Link>

                    <ShareButton
                      item={{
                        type: "mcp",
                        slug: server.id,
                        title: server.name,
                        description: server.description,
                        url: `/${locale}/mcp/${server.slug}`,
                        category: server.categoryLabel,
                        author: server.vendor,
                        stats: [
                          { label: "Tools", value: server.tools.length },
                          { label: "Stars", value: formatCompactNumber(server.stars) },
                          { label: "License", value: server.isOpenSource ? "OSS" : "Commercial" },
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
            );
          })}
        </div>
      )}
    </div>
  );
}
