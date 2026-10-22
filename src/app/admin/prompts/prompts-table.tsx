"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Edit,
  ExternalLink,
  ImageOff,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { deletePromptAction } from "./actions";
import { getCoverImage } from "@/lib/images";
import type { Prompt, Category } from "@/db/schema";

const COLUMNS = [
  { key: "title", label: "Judul & Slug" },
  { key: "image", label: "Gambar" },
  { key: "category", label: "Kategori" },
  { key: "variables", label: "Variabel" },
  { key: "status", label: "Status" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

interface PromptsTableProps {
  promptsList: (Prompt & { category?: Category | null })[];
  view: "grid" | "list";
  visibleColumns: string[];
  basePath: string;
  params: Record<string, string | undefined>;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded border font-medium whitespace-nowrap ${
        status === "published"
          ? "border-border bg-foreground text-background"
          : status === "draft"
          ? "border-border border-dashed text-muted-foreground"
          : "border-border text-muted-foreground line-through"
      }`}
    >
      {status}
    </span>
  );
}

function variableCount(variables: unknown): number {
  return Array.isArray(variables) ? variables.length : 0;
}

export function PromptsTable({
  promptsList,
  view,
  visibleColumns,
  basePath,
  params,
}: PromptsTableProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [columnsOpen, setColumnsOpen] = React.useState(false);
  const columnMenuRef = React.useRef<HTMLDivElement>(null);

  const visible = new Set(visibleColumns);
  const isColumnVisible = (key: ColumnKey) => visible.has(key);

  React.useEffect(() => {
    if (!columnsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target as Node)) {
        setColumnsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setColumnsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [columnsOpen]);

  const navigate = (updates: Record<string, string | undefined>) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, value);
    }
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") search.delete(key);
      else search.set(key, value);
    }
    const query = search.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  const toggleColumn = (key: ColumnKey) => {
    const next = new Set(visibleColumns);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    const ordered = COLUMNS.map((column) => column.key).filter((columnKey) =>
      next.has(columnKey)
    );
    navigate({ cols: ordered.length === 0 ? "none" : ordered.join(",") });
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deletePromptAction(id);
    setIsDeleting(false);
    setConfirmDeleteId(null);
    router.refresh();
  };

  const renderActions = (prompt: Prompt & { category?: Category | null }) => {
    if (confirmDeleteId === prompt.id) {
      return (
        <div className="inline-flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">Hapus?</span>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => handleDelete(prompt.id)}
            className="px-2 py-0.5 rounded bg-foreground text-background font-medium hover:opacity-90"
          >
            Ya
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteId(null)}
            className="px-2 py-0.5 rounded border border-border text-foreground"
          >
            Batal
          </button>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1">
        <Link
          href={`/id/prompts/${prompt.slug}`}
          target="_blank"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Lihat halaman publik"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/admin/prompts/${prompt.id}/edit`}
          className="p-1.5 rounded hover:bg-muted text-foreground"
          title="Edit prompt"
        >
          <Edit className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => setConfirmDeleteId(prompt.id)}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Hapus prompt"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted">
          <button
            type="button"
            onClick={() => navigate({ view: "grid" })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              view === "grid"
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => navigate({ view: "list" })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              view === "list"
                ? "bg-foreground text-background font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-surface"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>

        {view === "list" && (
          <div ref={columnMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setColumnsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded border border-border bg-surface hover:bg-muted text-xs cursor-pointer"
              aria-haspopup="true"
              aria-expanded={columnsOpen}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Kolom</span>
            </button>

            {columnsOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-52 rounded-lg border border-border bg-surface shadow-xl p-1.5">
                {COLUMNS.map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-2 px-1.5 py-1.5 rounded text-xs text-foreground hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isColumnVisible(column.key)}
                      onChange={() => toggleColumn(column.key)}
                    />
                    <span>{column.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {promptsList.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-md text-xs text-muted-foreground">
          Belum ada prompt yang sesuai filter.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {promptsList.map((prompt) => {
            const cover = getCoverImage(prompt.images);
            const vars = variableCount(prompt.variables);
            return (
              <article
                key={prompt.id}
                className="rounded-xl border border-border bg-surface overflow-hidden flex flex-col"
              >
                <Link
                  href={`/admin/prompts/${prompt.id}/edit`}
                  className="relative aspect-video bg-muted block"
                >
                  {cover ? (
                    <Image
                      src={cover}
                      alt={prompt.titleId}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <ImageOff className="w-5 h-5" />
                      <span className="text-[10px]">Tanpa gambar</span>
                    </div>
                  )}
                </Link>

                <div className="p-3.5 flex flex-col gap-2 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/prompts/${prompt.id}/edit`}
                        className="font-semibold text-sm text-foreground truncate block hover:underline"
                      >
                        {prompt.titleId}
                      </Link>
                      <div className="font-mono text-[11px] text-muted-foreground truncate">
                        /{prompt.slug}
                      </div>
                    </div>
                    <StatusBadge status={prompt.status} />
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    {prompt.category?.nameId || "Tanpa kategori"}
                  </div>

                  <div className="text-[11px] font-mono text-muted-foreground">
                    {vars} variabel
                  </div>

                  <div className="mt-auto pt-2 border-t border-border/60 flex justify-end">
                    {renderActions(prompt)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/60 text-muted-foreground">
              <tr>
                {isColumnVisible("title") && (
                  <th className="p-3 font-medium text-foreground">Judul &amp; Slug</th>
                )}
                {isColumnVisible("image") && (
                  <th className="p-3 font-medium text-foreground">Gambar</th>
                )}
                {isColumnVisible("category") && (
                  <th className="p-3 font-medium text-foreground">Kategori</th>
                )}
                {isColumnVisible("variables") && (
                  <th className="p-3 font-medium text-foreground">Variabel</th>
                )}
                {isColumnVisible("status") && (
                  <th className="p-3 font-medium text-foreground">Status</th>
                )}
                <th className="p-3 font-medium text-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promptsList.map((prompt) => {
                const cover = getCoverImage(prompt.images);
                const vars = variableCount(prompt.variables);
                return (
                  <tr key={prompt.id} className="hover:bg-muted/40 transition-colors">
                    {isColumnVisible("title") && (
                      <td className="p-3">
                        <div className="font-medium text-foreground">{prompt.titleId}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          /{prompt.slug}
                        </div>
                      </td>
                    )}
                    {isColumnVisible("image") && (
                      <td className="p-3">
                        <div className="relative w-12 h-8 rounded border border-border bg-muted overflow-hidden">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={prompt.titleId}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                              <ImageOff className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    {isColumnVisible("category") && (
                      <td className="p-3 text-muted-foreground">
                        {prompt.category?.nameId || "-"}
                      </td>
                    )}
                    {isColumnVisible("variables") && (
                      <td className="p-3">
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {vars} variabel
                        </span>
                      </td>
                    )}
                    {isColumnVisible("status") && (
                      <td className="p-3">
                        <StatusBadge status={prompt.status} />
                      </td>
                    )}
                    <td className="p-3 text-right">{renderActions(prompt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
