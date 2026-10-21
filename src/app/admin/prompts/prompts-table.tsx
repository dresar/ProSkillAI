"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { deletePromptAction } from "./actions";
import type { Prompt, Category } from "@/db/schema";

interface PromptsTableProps {
  promptsList: (Prompt & { category?: Category | null })[];
}

export function PromptsTable({ promptsList }: PromptsTableProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deletePromptAction(id);
    setIsDeleting(false);
    setConfirmDeleteId(null);
    router.refresh();
  };

  if (promptsList.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-500">
        Belum ada prompt yang sesuai filter.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden md:block rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-500">
            <tr>
              <th className="p-3 font-semibold text-foreground">Judul & Slug</th>
              <th className="p-3 font-semibold text-foreground">Kategori</th>
              <th className="p-3 font-semibold text-foreground">Variabel</th>
              <th className="p-3 font-semibold text-foreground">Status</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {promptsList.map((prompt) => {
              const vars = Array.isArray(prompt.variables) ? prompt.variables : [];
              return (
                <tr key={prompt.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                  <td className="p-3">
                    <div className="font-medium text-foreground">{prompt.titleId}</div>
                    <div className="text-[11px] font-mono text-neutral-400">/{prompt.slug}</div>
                  </td>
                  <td className="p-3 text-neutral-600 dark:text-neutral-400">
                    {prompt.category?.nameId || "-"}
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-mono text-neutral-500">
                      {vars.length} variabel
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                        prompt.status === "published"
                          ? "border-neutral-400 bg-neutral-100 dark:bg-neutral-800 text-foreground"
                          : prompt.status === "draft"
                          ? "border-neutral-200 dark:border-neutral-800 text-neutral-500"
                          : "border-neutral-200 dark:border-neutral-800 line-through text-neutral-400"
                      }`}
                    >
                      {prompt.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {confirmDeleteId === prompt.id ? (
                      <div className="inline-flex items-center gap-1.5 text-xs">
                        <span className="text-neutral-500">Hapus?</span>
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
                          className="px-2 py-0.5 rounded border border-neutral-300 dark:border-neutral-700 text-foreground"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/id/prompts/${prompt.slug}`}
                          target="_blank"
                          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-foreground"
                          title="Lihat halaman publik"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/prompts/${prompt.id}/edit`}
                          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
                          title="Edit prompt"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(prompt.id)}
                          className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-foreground"
                          title="Hapus prompt"
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

      <div className="md:hidden space-y-2.5">
        {promptsList.map((prompt) => (
          <div
            key={prompt.id}
            className="p-3.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-2 text-xs"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-foreground">{prompt.titleId}</h4>
                <div className="font-mono text-[11px] text-neutral-400">/{prompt.slug}</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                {prompt.status}
              </span>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-end gap-2">
              {confirmDeleteId === prompt.id ? (
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-neutral-500">Hapus?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(prompt.id)}
                    className="px-2 py-1 rounded bg-foreground text-background font-medium"
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href={`/id/prompts/${prompt.slug}`}
                    target="_blank"
                    className="p-1 rounded text-neutral-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/prompts/${prompt.id}/edit`}
                    className="p-1 rounded text-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(prompt.id)}
                    className="p-1 rounded text-neutral-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
