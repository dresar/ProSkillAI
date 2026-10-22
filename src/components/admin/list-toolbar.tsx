"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";

interface StatusOption {
  label: string;
  value?: string;
}

interface CategoryOption {
  id: string;
  slug: string;
  nameId: string;
  nameEn?: string;
}

interface AdminListToolbarProps {
  basePath: string;
  q?: string;
  status?: string;
  category?: string;
  pageSize: number;
  params: Record<string, string | undefined>;
  statusOptions: StatusOption[];
  categories?: CategoryOption[];
  placeholder: string;
}

export function AdminListToolbar({
  basePath,
  q,
  status,
  category,
  pageSize,
  params,
  statusOptions,
  categories,
  placeholder,
}: AdminListToolbarProps) {
  const router = useRouter();

  const navigate = (updates: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, value);
    }
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") search.delete(key);
      else search.set(key, value);
    }
    search.delete("page");
    const query = search.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          navigate({ q: String(formData.get("q") || "").trim() });
        }}
        className="flex items-center gap-1.5 w-full sm:w-auto"
      >
        <div className="relative flex-1 sm:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            key={q ?? ""}
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder={placeholder}
            className="h-8 w-full pl-8 pr-2 text-xs rounded-lg border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground"
          />
        </div>
        <button
          type="submit"
          className="h-8 px-3 rounded-lg border border-border bg-surface hover:bg-muted text-xs font-medium cursor-pointer shrink-0"
        >
          Cari
        </button>
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative inline-flex items-center">
          <select
            value={status ?? ""}
            onChange={(event) => navigate({ status: event.target.value || undefined })}
            className={`h-8 pl-2.5 pr-7 text-xs rounded-lg border appearance-none cursor-pointer focus:outline-2 focus:outline-foreground font-medium transition-colors ${
              status
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-foreground hover:border-foreground/40"
            }`}
            aria-label="Filter status"
          >
            {statusOptions.map((option) => (
              <option
                key={option.label}
                value={option.value ?? ""}
                className="bg-surface text-foreground"
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
              status ? "text-background" : "text-muted-foreground"
            }`}
          />
        </div>

        {categories && categories.length > 0 && (
          <div className="relative inline-flex items-center">
            <select
              value={category ?? ""}
              onChange={(event) => navigate({ category: event.target.value || undefined })}
              className={`h-8 pl-2.5 pr-7 text-xs rounded-lg border appearance-none cursor-pointer focus:outline-2 focus:outline-foreground font-medium transition-colors ${
                category
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-foreground hover:border-foreground/40"
              }`}
              aria-label="Filter kategori"
            >
              <option value="" className="bg-surface text-foreground">
                Semua Kategori
              </option>
              {categories.map((cat) => (
                <option
                  key={cat.id}
                  value={cat.slug}
                  className="bg-surface text-foreground"
                >
                  {cat.nameId}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${
                category ? "text-background" : "text-muted-foreground"
              }`}
            />
          </div>
        )}

        <div className="relative inline-flex items-center">
          <select
            value={String(pageSize)}
            onChange={(event) => navigate({ pageSize: event.target.value })}
            className="h-8 pl-2.5 pr-7 text-xs rounded-lg border border-border bg-surface text-foreground appearance-none cursor-pointer focus:outline-2 focus:outline-foreground font-medium hover:border-foreground/40 transition-colors"
            aria-label="Jumlah data per halaman"
          >
            <option value="12">12 / hal</option>
            <option value="24">24 / hal</option>
            <option value="48">48 / hal</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
