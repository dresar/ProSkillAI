"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { Category } from "@/db/schema";

interface CatalogToolbarProps {
  categories: Category[];
  locale: string;
  totalCount: number;
}

export function CatalogToolbar({ categories, locale, totalCount }: CatalogToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchValue, setSearchValue] = React.useState(currentSearch);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === "") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchValue.trim() || null });
  };

  const selectedCategoryObj = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <label htmlFor="catalog-search" className="sr-only">
            {locale === "en" ? "Search items" : "Cari item"}
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={locale === "en" ? "Search..." : "Cari..."}
            className="w-full h-9 pl-9 pr-8 text-xs sm:text-sm rounded-lg border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                updateParams({ q: null });
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={locale === "en" ? "Clear search" : "Hapus pencarian"}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className={`inline-flex items-center gap-1.5 h-9 px-3 text-xs font-medium rounded-lg border ${
              currentCategory
                ? "border-foreground bg-foreground text-background font-semibold"
                : "border-border bg-surface text-foreground hover:bg-muted"
            } transition-colors cursor-pointer`}
            aria-expanded={filterOpen}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Filter" : "Filter"}</span>
          </button>

          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="h-9 px-2.5 text-xs rounded-lg border border-border bg-surface text-foreground cursor-pointer focus:outline-2 focus:outline-foreground"
            aria-label={locale === "en" ? "Sort items" : "Urutkan item"}
          >
            <option value="newest">{locale === "en" ? "Newest" : "Terbaru"}</option>
            <option value="oldest">{locale === "en" ? "Oldest" : "Terlama"}</option>
            <option value="popular">{locale === "en" ? "Most popular" : "Terpopuler"}</option>
          </select>
        </div>
      </div>

      {filterOpen && (
        <div className="p-3 rounded-lg border border-border bg-muted/40 flex flex-wrap gap-2 animate-in fade-in">
          <button
            type="button"
            onClick={() => updateParams({ category: null })}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
              !currentCategory
                ? "border-foreground bg-foreground text-background font-semibold"
                : "border-border bg-surface text-foreground hover:bg-muted"
            }`}
          >
            {locale === "en" ? "All Categories" : "Semua Kategori"}
          </button>
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updateParams({ category: cat.slug })}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? "border-foreground bg-foreground text-background font-semibold"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {locale === "en" ? cat.nameEn : cat.nameId}
              </button>
            );
          })}
        </div>
      )}

      {(currentSearch || currentCategory) && (
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-muted-foreground">
          <span>{locale === "en" ? "Active filters:" : "Filter aktif:"}</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
              &ldquo;{currentSearch}&rdquo;
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateParams({ q: null });
                }}
                className="hover:text-muted-foreground cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategoryObj && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
              {locale === "en" ? selectedCategoryObj.nameEn : selectedCategoryObj.nameId}
              <button
                type="button"
                onClick={() => updateParams({ category: null })}
                className="hover:text-muted-foreground cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              router.push(pathname);
            }}
            className="text-xs text-foreground underline hover:opacity-75 cursor-pointer ml-1"
          >
            {locale === "en" ? "Clear all" : "Hapus semua"}
          </button>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        {locale === "en"
          ? `Showing ${totalCount} result${totalCount === 1 ? "" : "s"}`
          : `Menampilkan ${totalCount} hasil`}
      </div>
    </div>
  );
}
