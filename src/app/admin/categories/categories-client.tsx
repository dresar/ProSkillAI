"use client";

import * as React from "react";
import { useActionState } from "react";
import { createCategoryAction, deleteCategoryAction } from "./actions";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import type { Category } from "@/db/schema";

export function CategoriesClient({ categoriesList }: { categoriesList: Category[] }) {
  const [state, formAction, isPending] = useActionState(createCategoryAction, null);
  const [openNew, setOpenNew] = React.useState(false);
  const [confirmId, setConfirmId] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Kategori Konten
          </h2>
          <p className="text-xs text-neutral-500">
            Kategori yang digunakan untuk mengelompokkan skill dan prompt.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpenNew(!openNew)}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {openNew && (
        <form
          action={formAction}
          className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-4 text-xs animate-in fade-in"
        >
          <h3 className="font-semibold text-foreground">Kategori Baru</h3>

          {state?.error && (
            <div className="p-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-foreground flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{state.error}</span>
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
                className="w-full h-8 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
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
                className="w-full h-8 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
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
                className="w-full h-8 px-2.5 font-mono rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
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
                className="w-full h-8 px-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
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
              className="h-8 px-3 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="h-8 px-4 rounded bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500">
            <tr>
              <th className="p-3 font-semibold text-foreground">Nama (ID / EN)</th>
              <th className="p-3 font-semibold text-foreground">Slug</th>
              <th className="p-3 font-semibold text-foreground">Tipe</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {categoriesList.map((cat) => (
              <tr key={cat.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                <td className="p-3">
                  <span className="font-medium text-foreground">{cat.nameId}</span>
                  <span className="text-neutral-400 ml-1.5 font-normal">/ {cat.nameEn}</span>
                </td>
                <td className="p-3 font-mono text-neutral-500">{cat.slug}</td>
                <td className="p-3">
                  <span className="px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-[11px]">
                    {cat.type}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {confirmId === cat.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-neutral-500">Hapus?</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await deleteCategoryAction(cat.id);
                          setConfirmId(null);
                        }}
                        className="px-2 py-0.5 rounded bg-foreground text-background font-medium"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(cat.id)}
                      className="p-1 rounded text-neutral-400 hover:text-foreground"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
