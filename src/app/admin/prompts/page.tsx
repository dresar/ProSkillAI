import { getAdminPrompts, getAllCategories } from "@/db/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminListToolbar } from "@/components/admin/list-toolbar";
import { AdminPagination } from "@/components/admin/pagination";
import { PromptsTable } from "./prompts-table";

const BASE_PATH = "/admin/prompts";
const COLUMN_KEYS = ["title", "image", "category", "variables", "status"];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
    view?: string;
    cols?: string;
  }>;
}

function parsePageSize(value?: string): number {
  const parsed = Number(value);
  return [12, 24, 48].includes(parsed) ? parsed : 12;
}

function parseColumns(value?: string): string[] {
  if (value === undefined) return COLUMN_KEYS;
  if (value === "none") return [];
  const requested = value.split(",").map((item) => item.trim());
  return COLUMN_KEYS.filter((key) => requested.includes(key));
}

export default async function AdminPromptsPage({ searchParams }: PageProps) {
  const { q, status, category, sort, page, pageSize, view, cols } = await searchParams;

  const pageSizeNumber = parsePageSize(pageSize);
  const pageNumber = Math.max(1, Number(page) || 1);
  const visibleColumns = parseColumns(cols);

  const [{ rows, total }, categoriesList] = await Promise.all([
    getAdminPrompts({ q, status, sort, page: pageNumber, pageSize: pageSizeNumber }),
    getAllCategories("all"),
  ]);

  const catMap = new Map(categoriesList.map((c) => [c.id, c]));

  let formatted = rows.map((prompt) => ({
    ...prompt,
    category: prompt.categoryId ? catMap.get(prompt.categoryId) || null : null,
  }));

  if (category) {
    formatted = formatted.filter(
      (prompt) => prompt.categoryId === category || prompt.category?.slug === category
    );
  }

  const params = {
    q,
    status,
    category,
    sort,
    pageSize: String(pageSizeNumber),
    view,
    cols,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Manajemen Prompt Rekayasa AI
          </h2>
          <p className="text-xs text-muted-foreground">
            Daftar seluruh prompt terverifikasi dengan dukungan variabel dinamis.
          </p>
        </div>

        <Link
          href="/admin/prompts/new"
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Prompt Baru</span>
        </Link>
      </div>

      <AdminListToolbar
        basePath={BASE_PATH}
        q={q}
        status={status}
        category={category}
        pageSize={pageSizeNumber}
        params={params}
        categories={categoriesList}
        placeholder="Cari judul atau slug prompt..."
        statusOptions={[
          { label: "Semua Status" },
          { label: "Terbit", value: "published" },
          { label: "Draft", value: "draft" },
          { label: "Arsip", value: "archived" },
        ]}
      />

      <PromptsTable
        promptsList={formatted}
        view={view === "list" ? "list" : "grid"}
        visibleColumns={visibleColumns}
        basePath={BASE_PATH}
        params={params}
      />

      <AdminPagination
        page={pageNumber}
        pageSize={pageSizeNumber}
        total={category ? formatted.length : total}
        basePath={BASE_PATH}
        params={params}
      />
    </div>
  );
}
