"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { deleteSkillAction } from "./actions";
import type { Skill, Category } from "@/db/schema";

interface SkillsTableProps {
  skillsList: (Skill & { category?: Category | null })[];
}

export function SkillsTable({ skillsList }: SkillsTableProps) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    await deleteSkillAction(id);
    setIsDeleting(false);
    setConfirmDeleteId(null);
    router.refresh();
  };

  if (skillsList.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-500">
        Belum ada skill yang sesuai filter.
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
              <th className="p-3 font-semibold text-foreground">Sumber</th>
              <th className="p-3 font-semibold text-foreground">Status</th>
              <th className="p-3 font-semibold text-foreground text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {skillsList.map((skill) => (
              <tr key={skill.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30">
                <td className="p-3">
                  <div className="font-medium text-foreground">{skill.titleId}</div>
                  <div className="text-[11px] font-mono text-neutral-400">/{skill.slug}</div>
                </td>
                <td className="p-3 text-neutral-600 dark:text-neutral-400">
                  {skill.category?.nameId || "-"}
                </td>
                <td className="p-3">
                  <span className="text-[11px] px-1.5 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
                    {skill.sourceType === "github" ? "GitHub" : "Orisinal"}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                      skill.status === "published"
                        ? "border-neutral-400 bg-neutral-100 dark:bg-neutral-800 text-foreground"
                        : skill.status === "draft"
                        ? "border-neutral-200 dark:border-neutral-800 text-neutral-500"
                        : "border-neutral-200 dark:border-neutral-800 line-through text-neutral-400"
                    }`}
                  >
                    {skill.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {confirmDeleteId === skill.id ? (
                    <div className="inline-flex items-center gap-1.5 text-xs">
                      <span className="text-neutral-500">Hapus?</span>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(skill.id)}
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
                        href={`/id/skills/${skill.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-foreground"
                        title="Lihat halaman publik"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/skills/${skill.id}/edit`}
                        className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground"
                        title="Edit skill"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(skill.id)}
                        className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-foreground"
                        title="Hapus skill"
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

      <div className="md:hidden space-y-2.5">
        {skillsList.map((skill) => (
          <div
            key={skill.id}
            className="p-3.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface space-y-2 text-xs"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-foreground">{skill.titleId}</h4>
                <div className="font-mono text-[11px] text-neutral-400">/{skill.slug}</div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-neutral-300 dark:border-neutral-700">
                {skill.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
              <span>{skill.category?.nameId || "-"}</span>
              <span>&bull;</span>
              <span>{skill.sourceType === "github" ? "GitHub" : "Orisinal"}</span>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex justify-end gap-2">
              {confirmDeleteId === skill.id ? (
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-neutral-500">Hapus?</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
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
                    href={`/id/skills/${skill.slug}`}
                    target="_blank"
                    className="p-1 rounded text-neutral-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/skills/${skill.id}/edit`}
                    className="p-1 rounded text-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(skill.id)}
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
