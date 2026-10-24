"use client";

import * as React from "react";
import { useActionState } from "react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions";
import { Plus, Trash2, Edit, AlertCircle, CheckCircle2, X, Search, LayoutGrid, List, Tag } from "lucide-react";
import type { Category } from "@/db/schema";

export function CategoriesClient({ categoriesList }: { categoriesList: Category[] }) {
  const [items, setItems] = React.useState<Category[]>(categoriesList);
  const [createState, createAction, isCreating] = useActionState(createCategoryAction, null);
  const [openNew, setOpenNew] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [editState, setEditState] = React.useState<{ error?: string; success?: boolean } | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  React.useEffect(() => {
    setItems(categoriesList);
  }, [categoriesList]);

  React.useEffect(() => {
    if (createState?.success) {
      setOpenNew(false);
    }
  }, [createState]);

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsEditing(true);
    setEditState(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateCategoryAction(editingCategory.id, null, formData);
    setIsEditing(false);
    if (res?.error) {
      setEditState({ error: res.error });
    } else {
      setEditState({ success: true });
      setTimeout(() => {
        setEditingCategory(null);
        setEditState(null);
      }, 700);
    }
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((cat) => cat.id !== id));
    setConfirmId(null);
    await deleteCategoryAction(id);
  };

  const filteredCategories = React.useMemo(() => {
    return items.filter((cat) => {
      const name = (cat.nameEn || cat.nameId || "").toLowerCase();
      const slug = (cat.slug || "").toLowerCase();
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || name.includes(query) || slug.includes(query);
      const matchesType = typeFilter === "all" || cat.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [items, search, typeFilter]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Kategori
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pengelompokan skill dan prompt direktori publik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpenNew(!openNew);
            setEditingCategory(null);
          }}
          className="inline-flex items-center gap-1.5 h-8.5 px-3.5 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {openNew && (
        <form
          action={createAction}
          className="p-4 rounded-[8px] border border-border bg-surface space-y-3.5 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h3 className="font-semibold text-foreground">Kategori Baru</h3>
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="p-1 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {createState?.error && (
            <div className="p-2.5 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-500 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{createState.error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="cat-name-new" className="block font-medium text-foreground">
                Nama Kategori *
              </label>
              <input
                id="cat-name-new"
                name="name"
                type="text"
                required
                placeholder="e.g. Prompt Engineering"
                className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-type-new" className="block font-medium text-foreground">
                Tipe
              </label>
              <select
                id="cat-type-new"
                name="type"
                defaultValue="all"
                className="w-full h-8.5 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="all">Semua</option>
                <option value="skill">Skill</option>
                <option value="prompt">Prompt</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="cat-slug-new" className="block font-medium text-foreground">
                Slug (Opsional)
              </label>
              <input
                id="cat-slug-new"
                name="slug"
                type="text"
                placeholder="Otomatis jika kosong"
                className="w-full h-8.5 px-3 font-mono rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-desc-new" className="block font-medium text-foreground">
                Deskripsi (Opsional)
              </label>
              <input
                id="cat-desc-new"
                name="description"
                type="text"
                placeholder="Deskripsi singkat kategori..."
                className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="h-8 px-3.5 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isCreating ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      )}

      {editingCategory && (
        <form
          onSubmit={handleEditSubmit}
          className="p-4 rounded-[8px] border border-foreground/30 bg-surface space-y-3.5 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-foreground" />
              <h3 className="font-semibold text-foreground">
                Edit: {editingCategory.nameEn || editingCategory.nameId}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="p-1 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {editState?.error && (
            <div className="p-2.5 rounded-[6px] border border-rose-500/30 bg-rose-500/10 text-rose-500 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{editState.error}</span>
            </div>
          )}

          {editState?.success && (
            <div className="p-2.5 rounded-[6px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Kategori berhasil diperbarui.</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="cat-name-edit" className="block font-medium text-foreground">
                Nama Kategori *
              </label>
              <input
                id="cat-name-edit"
                name="name"
                type="text"
                required
                defaultValue={editingCategory.nameEn || editingCategory.nameId}
                className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-type-edit" className="block font-medium text-foreground">
                Tipe
              </label>
              <select
                id="cat-type-edit"
                name="type"
                defaultValue={editingCategory.type}
                className="w-full h-8.5 px-2.5 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="all">Semua</option>
                <option value="skill">Skill</option>
                <option value="prompt">Prompt</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="cat-slug-edit" className="block font-medium text-foreground">
                Slug *
              </label>
              <input
                id="cat-slug-edit"
                name="slug"
                type="text"
                required
                defaultValue={editingCategory.slug}
                className="w-full h-8.5 px-3 font-mono rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-desc-edit" className="block font-medium text-foreground">
                Deskripsi
              </label>
              <input
                id="cat-desc-edit"
                name="description"
                type="text"
                defaultValue={editingCategory.descriptionEn || editingCategory.descriptionId || ""}
                className="w-full h-8.5 px-3 rounded-[6px] border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="h-8 px-3.5 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isEditing}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs cursor-pointer"
            >
              {isEditing ? "Menyimpan..." : "Perbarui"}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="w-full h-8.5 pl-8 pr-3 rounded-[6px] border border-border bg-surface text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-8.5 px-2.5 rounded-[6px] border border-border bg-surface text-xs text-foreground focus:outline-none font-mono"
          >
            <option value="all">Semua Tipe</option>
            <option value="skill">Skill</option>
            <option value="prompt">Prompt</option>
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <span className="text-xs text-muted-foreground font-mono">
            {filteredCategories.length} kategori
          </span>

          <div className="inline-flex items-center rounded-[6px] border border-border bg-surface p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`h-7.5 px-2.5 rounded-[4px] inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "grid"
                  ? "bg-foreground text-background font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan Grid"
              aria-label="Tampilan Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`h-7.5 px-2.5 rounded-[4px] inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                viewMode === "list"
                  ? "bg-foreground text-background font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Tampilan List"
              aria-label="Tampilan List"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-[8px] border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
          Tidak ada kategori yang cocok dengan pencarian.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filteredCategories.map((cat) => {
            const displayName = cat.nameEn || cat.nameId;
            const displayDesc = cat.descriptionEn || cat.descriptionId || "";
            return (
              <div
                key={cat.id}
                className="group rounded-[8px] border border-border bg-surface p-3.5 flex flex-col justify-between hover:border-foreground/40 transition-all shadow-2xs space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-1.5">
                    <span className="font-semibold text-xs sm:text-sm text-foreground tracking-tight leading-tight line-clamp-1" title={displayName}>
                      {displayName}
                    </span>
                    <span className="shrink-0 px-1.5 py-0.5 rounded-[4px] border border-border bg-muted text-foreground text-[10px] font-mono capitalize">
                      {cat.type}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-muted-foreground truncate">
                    /{cat.slug}
                  </div>

                  {displayDesc ? (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  ) : (
                    <div className="text-[11px] text-muted-foreground/60 italic">
                      Tanpa deskripsi
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border/70 flex items-center justify-between gap-1">
                  {confirmId === cat.id ? (
                    <div className="w-full flex items-center justify-between gap-1.5">
                      <span className="text-[11px] text-rose-500 font-medium">Hapus?</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="h-7 px-2 rounded-[5px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="h-7 px-2 rounded-[5px] border border-border bg-background text-foreground text-xs hover:bg-muted cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setOpenNew(false);
                        }}
                        className="h-8 inline-flex items-center justify-center rounded-[6px] border border-border bg-background text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer shadow-2xs"
                        title="Edit"
                        aria-label="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmId(cat.id)}
                        className="h-8 inline-flex items-center justify-center rounded-[6px] border border-border bg-background text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer shadow-2xs"
                        title="Hapus"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[8px] border border-border bg-surface overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="p-3 font-semibold text-foreground">Kategori</th>
                  <th className="p-3 font-semibold text-foreground">Slug</th>
                  <th className="p-3 font-semibold text-foreground">Tipe</th>
                  <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCategories.map((cat) => {
                  const displayName = cat.nameEn || cat.nameId;
                  const displayDesc = cat.descriptionEn || cat.descriptionId || "";
                  return (
                    <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3 min-w-[160px]">
                        <div className="font-semibold text-foreground text-xs sm:text-sm">
                          {displayName}
                        </div>
                        {displayDesc && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {displayDesc}
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground text-[11px] whitespace-nowrap">
                        /{cat.slug}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-[4px] border border-border bg-muted text-foreground text-[11px] font-mono capitalize">
                          {cat.type}
                        </span>
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        {confirmId === cat.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="text-[11px] text-rose-500 font-medium">Hapus?</span>
                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id)}
                              className="h-7 px-2 rounded-[5px] bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
                            >
                              Ya
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(null)}
                              className="h-7 px-2 rounded-[5px] border border-border bg-background text-foreground text-xs hover:bg-muted cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(cat);
                                setOpenNew(false);
                              }}
                              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-[5px] border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs"
                              title="Edit"
                              aria-label="Edit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmId(cat.id)}
                              className="h-7.5 w-7.5 inline-flex items-center justify-center rounded-[5px] border border-border bg-background text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer shadow-2xs"
                              title="Hapus"
                              aria-label="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
