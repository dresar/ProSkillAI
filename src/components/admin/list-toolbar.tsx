"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface StatusOption {
  label: string;
  value?: string;
}

interface AdminListToolbarProps {
  basePath: string;
  q?: string;
  status?: string;
  pageSize: number;
  params: Record<string, string | undefined>;
  statusOptions: StatusOption[];
  placeholder: string;
}

export function AdminListToolbar({
  basePath,
  q,
  status,
  pageSize,
  params,
  statusOptions,
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          navigate({ q: String(formData.get("q") || "").trim() });
        }}
        className="flex items-center gap-1.5"
      >
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            key={q ?? ""}
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder={placeholder}
            className="h-8 w-56 pl-7 pr-2 text-xs rounded border border-border bg-surface text-foreground focus:outline-2 focus:outline-foreground"
          />
        </div>
        <button
          type="submit"
          className="h-8 px-2.5 rounded border border-border bg-surface hover:bg-muted text-xs cursor-pointer"
        >
          Cari
        </button>
      </form>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {statusOptions.map((option) => {
            const active = (status ?? "") === (option.value ?? "");
            return (
              <button
                key={option.label}
                type="button"
                onClick={() => navigate({ status: option.value })}
                className={`px-2.5 py-1 text-xs rounded border ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-foreground hover:bg-muted"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <select
          value={String(pageSize)}
          onChange={(event) => navigate({ pageSize: event.target.value })}
          className="h-8 px-2 text-xs rounded border border-border bg-surface text-foreground cursor-pointer"
          aria-label="Jumlah data per halaman"
        >
          <option value="12">12 / halaman</option>
          <option value="24">24 / halaman</option>
          <option value="48">48 / halaman</option>
        </select>
      </div>
    </div>
  );
}
