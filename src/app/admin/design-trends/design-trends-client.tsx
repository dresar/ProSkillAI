"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  Heart,
  Copy,
  Eye,
  Filter,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { deleteDesignTrendAction, toggleDesignTrendStatusAction } from "./actions";
import type { UiInspiration } from "@/db/schema";
import { UiInspirationPreviewRenderer } from "@/components/ui-inspiration-preview-renderer";

interface DesignTrendsClientProps {
  initialItems: UiInspiration[];
  userRole: string;
}

const CATEGORIES = [
  { value: "all", label: "Semua Kategori" },
  { value: "cards", label: "Cards & Grid" },
  { value: "agentic", label: "Agentic & AI" },
  { value: "nav", label: "Navigation" },
  { value: "forms", label: "Forms & Controls" },
  { value: "metrics", label: "Telemetry & Metrics" },
  { value: "modals", label: "Modals & Feedback" },
];

export function DesignTrendsClient({ initialItems, userRole }: DesignTrendsClientProps) {
  const [items, setItems] = React.useState<UiInspiration[]>(initialItems);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchTitle =
          item.titleEn.toLowerCase().includes(q) ||
          item.titleId.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q) ||
          (item.tags as string[] | null)?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle) return false;
      }
      return true;
    });
  }, [items, categoryFilter, statusFilter, search]);

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteDesignTrendAction(id);
    setConfirmDeleteId(null);
    setBusyId(null);
  };

  const handleStatusChange = async (id: string, newStatus: "published" | "draft" | "archived") => {
    setBusyId(id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    await toggleDesignTrendStatusAction(id, newStatus);
    setBusyId(null);
  };

  const stats = {
    total: items.length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
    totalLikes: items.reduce((acc, curr) => acc + (curr.likesCount || 0), 0),
    totalCopies: items.reduce((acc, curr) => acc + (curr.copyCount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-foreground tracking-tight">
            Manajemen Design Trends
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola katalog pola antarmuka modern yang tayang di rute /ui.
          </p>
        </div>

        <Link
          href="/admin/design-trends/new"
          className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3 text-xs font-semibold text-background hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Pola Baru</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-[8px] border border-border bg-surface">
          <span className="text-[11px] text-muted-foreground font-medium">Total Pola</span>
          <div className="text-xl font-bold font-mono text-foreground mt-1">{stats.total}</div>
        </div>
        <div className="p-3 rounded-[8px] border border-border bg-surface">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Terbit (Live)</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{stats.published}</div>
        </div>
        <div className="p-3 rounded-[8px] border border-border bg-surface">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Draf / Review</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{stats.draft}</div>
        </div>
        <div className="p-3 rounded-[8px] border border-border bg-surface">
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">Interaksi (Likes/Salin)</span>
          <div className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
            {stats.totalLikes} / {stats.totalCopies}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-2">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, slug, atau tag..."
              className="w-full h-8 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-1 border border-border rounded-[6px] p-0.5 bg-surface self-end md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-[4px] transition-colors ${
              viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Tampilan Tabel"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-[4px] transition-colors ${
              viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Tampilan Grid Preview"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-[8px] border border-dashed border-border text-xs text-muted-foreground">
          Tidak ada pola Design Trends yang cocok dengan filter.
        </div>
      ) : viewMode === "list" ? (
        <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold text-foreground">Judul & Slug</th>
                <th className="p-3 font-semibold text-foreground">Kategori</th>
                <th className="p-3 font-semibold text-foreground">Status</th>
                <th className="p-3 font-semibold text-foreground">Metrik</th>
                <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-foreground line-clamp-1">{item.titleEn}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">/ui/{item.slug}</div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-[4px] border border-border bg-muted">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={item.status}
                      disabled={busyId === item.id}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as "published" | "draft" | "archived")
                      }
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border focus:outline-none ${
                        item.status === "published"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : item.status === "draft"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        {item.likesCount}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Copy className="w-3 h-3 text-cyan-500" />
                        {item.copyCount}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/id/ui/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/design-trends/${item.id}/edit`}
                        className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Pola"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        disabled={busyId === item.id}
                        className="p-1.5 rounded-[4px] text-rose-500 hover:bg-rose-500/10"
                        title="Hapus Pola"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-[8px] border border-border bg-surface p-3 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] border border-border bg-muted/20 flex items-center justify-center p-2">
                  <UiInspirationPreviewRenderer slug={item.slug} className="scale-75 origin-center" />
                  <span className="absolute top-2 left-2 rounded-[4px] bg-background/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground border border-border">
                    {item.category}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h3 className="font-semibold text-xs text-foreground line-clamp-1">{item.titleEn}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">/ui/{item.slug}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {item.likesCount} suka · {item.copyCount} salin
                </span>

                <div className="inline-flex items-center gap-1">
                  <Link
                    href={`/id/ui/${item.slug}`}
                    target="_blank"
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href={`/admin/design-trends/${item.id}/edit`}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-1 text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[8px] border border-border bg-surface p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-foreground">Hapus Pola Design Trend</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus pola ini secara permanen dari database? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="h-8 px-3 rounded-[6px] border border-border text-xs text-foreground hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                className="h-8 px-3 rounded-[6px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
