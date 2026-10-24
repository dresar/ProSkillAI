"use client";

import * as React from "react";
import { useActionState } from "react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions";
import { Plus, Trash2, Edit, AlertCircle, CheckCircle2, X } from "lucide-react";
import type { Category } from "@/db/schema";

export function CategoriesClient({ categoriesList }: { categoriesList: Category[] }) {
  const [createState, createAction, isCreating] = useActionState(createCategoryAction, null);
  const [openNew, setOpenNew] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [editState, setEditState] = React.useState<{ error?: string; success?: boolean } | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

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
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Kategori Konten
          </h2>
          <p className="text-xs text-muted-foreground">
            Kategori yang digunakan untuk mengelompokkan skill dan prompt di direktori publik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpenNew(!openNew);
            setEditingCategory(null);
          }}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {openNew && (
        <form
          action={createAction}
          className="p-4 rounded-[8px] border border-border bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Kategori Baru</h3>
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="text-muted-foreground hover:text-foreground"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="cat-nameId" className="block font-medium text-foreground">
                Nama (Bahasa Indonesia) *
              </label>
              <input
                id="cat-nameId"
                name="nameId"
                type="text"
                required
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-nameEn" className="block font-medium text-foreground">
                Name (English) *
              </label>
              <input
                id="cat-nameEn"
                name="nameEn"
                type="text"
                required
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-slug" className="block font-medium text-foreground">
                Slug URL *
              </label>
              <input
                id="cat-slug"
                name="slug"
                type="text"
                required
                placeholder="e.g. prompt-engineering"
                className="w-full h-8 px-2.5 font-mono rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="cat-type" className="block font-medium text-foreground">
                Tipe Penerapan
              </label>
              <select
                id="cat-type"
                name="type"
                defaultValue="all"
                className="w-full h-8 px-2 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="all">Semua (Skill & Prompt)</option>
                <option value="skill">Skill Saja</option>
                <option value="prompt">Prompt Saja</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpenNew(false)}
              className="h-8 px-3 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              {isCreating ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>
      )}

      {editingCategory && (
        <form
          onSubmit={handleEditSubmit}
          className="p-4 rounded-[8px] border border-cyan-500/40 bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-cyan-500" />
              <h3 className="font-semibold text-foreground">
                Edit Kategori: {editingCategory.nameEn}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="text-muted-foreground hover:text-foreground"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block font-medium text-foreground">
                Nama (Bahasa Indonesia) *
              </label>
              <input
                name="nameId"
                type="text"
                required
                defaultValue={editingCategory.nameId}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">
                Name (English) *
              </label>
              <input
                name="nameEn"
                type="text"
                required
                defaultValue={editingCategory.nameEn}
                className="w-full h-8 px-2.5 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">
                Slug URL *
              </label>
              <input
                name="slug"
                type="text"
                required
                defaultValue={editingCategory.slug}
                className="w-full h-8 px-2.5 font-mono rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-foreground">
                Tipe Penerapan
              </label>
              <select
                name="type"
                defaultValue={editingCategory.type}
                className="w-full h-8 px-2 rounded-[6px] border border-border bg-surface text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                <option value="all">Semua (Skill & Prompt)</option>
                <option value="skill">Skill Saja</option>
                <option value="prompt">Prompt Saja</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="h-8 px-3 rounded-[6px] border border-border hover:bg-muted text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isEditing}
              className="h-8 px-4 rounded-[6px] bg-foreground text-background font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-xs"
            >
              {isEditing ? "Memperbarui..." : "Perbarui Kategori"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-[8px] border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 font-semibold text-foreground">Nama (ID / EN)</th>
              <th className="p-3 font-semibold text-foreground">Slug</th>
              <th className="p-3 font-semibold text-foreground">Tipe</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categoriesList.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3">
                  <span className="font-semibold text-foreground">{cat.nameId}</span>
                  <span className="text-muted-foreground ml-1.5 font-normal">/ {cat.nameEn}</span>
                </td>
                <td className="p-3 font-mono text-muted-foreground">{cat.slug}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-[4px] border border-border bg-muted text-foreground text-[11px] font-mono">
                    {cat.type}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {confirmId === cat.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-muted-foreground">Hapus?</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteCategoryAction(cat.id);
                          setConfirmId(null);
                        }}
                        className="px-2 py-0.5 rounded-[4px] bg-rose-600 text-white font-medium hover:bg-rose-700"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="px-2 py-0.5 rounded-[4px] border border-border text-foreground hover:bg-muted"
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
                        className="p-1 rounded-[4px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        title="Edit Kategori"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(cat.id)}
                        className="p-1 rounded-[4px] text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
