import { getAdminPrompts, getAllCategories } from "@/db/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PromptsTable } from "./prompts-table";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminPromptsPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams;

  const [promptsList, categoriesList] = await Promise.all([
    getAdminPrompts({ q, status }),
    getAllCategories("all"),
  ]);

  const catMap = new Map(categoriesList.map((c) => [c.id, c]));

  const formatted = promptsList.map((prompt) => ({
    ...prompt,
    category: prompt.categoryId ? catMap.get(prompt.categoryId) || null : null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Manajemen Prompt Rekayasa AI
          </h2>
          <p className="text-xs text-neutral-500">
            Daftar seluruh prompt terverifikasi dengan dukungan variabel dinamis.
          </p>
        </div>

        <Link
          href="/admin/prompts/new"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Prompt Baru</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/admin/prompts"
          className={`px-2.5 py-1 text-xs rounded border ${
            !status
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Semua
        </Link>
        <Link
          href="/admin/prompts?status=published"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "published"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Terbit
        </Link>
        <Link
          href="/admin/prompts?status=draft"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "draft"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Draft
        </Link>
        <Link
          href="/admin/prompts?status=archived"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "archived"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Arsip
        </Link>
      </div>

      <PromptsTable promptsList={formatted} />
    </div>
  );
}
