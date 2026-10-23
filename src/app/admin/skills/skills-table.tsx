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
  CheckCircle2,
} from "lucide-react";
import { deleteSkillAction, approveSkillAction } from "./actions";
import { getSkillCoverImage } from "@/lib/images";
import type { Skill, Category } from "@/db/schema";

const COLUMNS = [
  { key: "title", label: "Judul & Slug" },
  { key: "image", label: "Gambar" },
  { key: "category", label: "Kategori" },
  { key: "source", label: "Sumber" },
  { key: "preview", label: "Pratinjau" },
  { key: "status", label: "Status" },
] as const;

type ColumnKey = (typeof COLUMNS)[number]["key"];

interface SkillsTableProps {
  skillsList: (Skill & { category?: Category | null })[];
  view: "grid" | "list";
  visibleColumns: string[];
  basePath: string;
  params: Record<string, string | undefined>;
}

function getPreviewBadge(previewType: string): { label: string; active: boolean } {
  switch (previewType) {
    case "html":
      return { label: "HTML", active: true };
    case "video":
      return { label: "Video", active: true };
    case "image":
      return { label: "Gambar", active: true };
    case "markdown":
      return { label: "Markdown", active: true };
    case "tokens":
      return { label: "Token", active: true };
    default:
      return { label: "—", active: false };
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-[10px] px-1.5 py-0.5 rounded-[4px] border font-medium whitespace-nowrap ${
        status === "published"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
          : status === "pending"
          ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold"
          : status === "draft"
          ? "border-border/80 bg-muted/60 text-muted-foreground"
          : "border-border text-muted-foreground line-through"
      }`}
    >
      {status === "pending" ? "Review" : status === "published" ? "Terbit" : status}
    </span>
  );
}

function SourceBadge({ sourceType }: { sourceType: string }) {
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] border border-border/70 bg-muted/50 text-muted-foreground font-mono">
      {sourceType === "github" ? "GitHub" : "Orisinal"}
    </span>
  );
}

function PreviewBadge({ previewType }: { previewType: string }) {
  const preview = getPreviewBadge(previewType);
  if (!preview.active) {
    return null;
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-[4px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
      {preview.label}
    </span>
  );
}

export function SkillsTable({
  skillsList,
  view,
  visibleColumns,
  basePath,
  params,
}: SkillsTableProps) {
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
    await deleteSkillAction(id);
    setIsDeleting(false);
    setConfirmDeleteId(null);
    router.refresh();
  };

  const renderActions = (skill: Skill & { category?: Category | null }) => {
    if (confirmDeleteId === skill.id) {
      return (
        <div className="inline-flex items-center gap-1 text-[11px]">
          <span className="text-muted-foreground text-[10px]">Hapus?</span>
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => handleDelete(skill.id)}
            className="px-2 py-0.5 rounded-[4px] bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors cursor-pointer text-[10px]"
          >
            Ya
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteId(null)}
            className="px-2 py-0.5 rounded-[4px] border border-border text-foreground hover:bg-muted transition-colors cursor-pointer text-[10px]"
          >
            Batal
          </button>
        </div>
      );
    }

    return (
      <div className="inline-flex items-center gap-1">
        {skill.status === "pending" && (
          <button
            type="button"
            onClick={async () => {
              await approveSkillAction(skill.id);
              router.refresh();
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-[5px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-medium cursor-pointer transition-colors"
            title="Setujui dan Publikasikan"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="hidden sm:inline">Setujui</span>
          </button>
        )}
        <Link
          href={`/id/skills/${skill.slug}`}
          target="_blank"
          className="p-1.5 rounded-[5px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Lihat halaman publik"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/admin/skills/${skill.id}/edit`}
          className="p-1.5 rounded-[5px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Edit skill"
        >
          <Edit className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => setConfirmDeleteId(skill.id)}
          className="p-1.5 rounded-[5px] hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground transition-colors cursor-pointer"
          title="Hapus skill"
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

      {skillsList.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-md text-xs text-muted-foreground">
          Belum ada skill yang sesuai filter.
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {skillsList.map((skill) => {
            const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);
            return (
              <article
                key={skill.id}
                className="group rounded-xl border border-border/80 bg-surface overflow-hidden flex flex-col hover:border-foreground/30 hover:shadow-xs transition-all duration-200"
              >
                <Link
                  href={`/admin/skills/${skill.id}/edit`}
                  className="relative aspect-video bg-muted overflow-hidden block"
                >
                  {cover ? (
                    <Image
                      src={cover}
                      alt={skill.titleId}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <ImageOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-[9px] sm:text-[10px]">Tanpa gambar</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    <StatusBadge status={skill.status} />
                  </div>
                </Link>

                <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 sm:gap-2 flex-1">
                  <div className="min-w-0">
                    <Link
                      href={`/admin/skills/${skill.id}/edit`}
                      className="font-semibold text-xs sm:text-sm text-foreground truncate block hover:underline"
                    >
                      {skill.titleId}
                    </Link>
                    <div className="font-mono text-[10px] sm:text-[11px] text-muted-foreground truncate">
                      /{skill.slug}
                    </div>
                  </div>

                  <div className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                    {skill.category?.nameId || "Tanpa kategori"}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                    <SourceBadge sourceType={skill.sourceType} />
                    <PreviewBadge previewType={skill.previewType} />
                  </div>

                  <div className="mt-auto pt-2.5 border-t border-border/60 flex items-center justify-end">
                    {renderActions(skill)}
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
                {isColumnVisible("source") && (
                  <th className="p-3 font-medium text-foreground">Sumber</th>
                )}
                {isColumnVisible("preview") && (
                  <th className="p-3 font-medium text-foreground">Pratinjau</th>
                )}
                {isColumnVisible("status") && (
                  <th className="p-3 font-medium text-foreground">Status</th>
                )}
                <th className="p-3 font-medium text-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skillsList.map((skill) => {
                const cover = getSkillCoverImage(skill.images, skill.previewImageUrl);
                return (
                  <tr key={skill.id} className="hover:bg-muted/40 transition-colors">
                    {isColumnVisible("title") && (
                      <td className="p-3">
                        <div className="font-medium text-foreground">{skill.titleId}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">
                          /{skill.slug}
                        </div>
                      </td>
                    )}
                    {isColumnVisible("image") && (
                      <td className="p-3">
                        <div className="relative w-12 h-8 rounded border border-border bg-muted overflow-hidden">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={skill.titleId}
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
                        {skill.category?.nameId || "-"}
                      </td>
                    )}
                    {isColumnVisible("source") && (
                      <td className="p-3">
                        <SourceBadge sourceType={skill.sourceType} />
                      </td>
                    )}
                    {isColumnVisible("preview") && (
                      <td className="p-3">
                        <PreviewBadge previewType={skill.previewType} />
                      </td>
                    )}
                    {isColumnVisible("status") && (
                      <td className="p-3">
                        <StatusBadge status={skill.status} />
                      </td>
                    )}
                    <td className="p-3 text-right">{renderActions(skill)}</td>
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
