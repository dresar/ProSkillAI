import { getAdminSkills, getAllCategories } from "@/db/queries";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminListToolbar } from "@/components/admin/list-toolbar";
import { AdminPagination } from "@/components/admin/pagination";
import { SkillsTable } from "./skills-table";

const BASE_PATH = "/admin/skills";
const COLUMN_KEYS = ["title", "image", "category", "source", "preview", "status"];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
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

export default async function AdminSkillsPage({ searchParams }: PageProps) {
  const { q, status, sort, page, pageSize, view, cols } = await searchParams;

  const pageSizeNumber = parsePageSize(pageSize);
  const pageNumber = Math.max(1, Number(page) || 1);
  const visibleColumns = parseColumns(cols);

  const [{ rows, total }, categoriesList] = await Promise.all([
    getAdminSkills({ q, status, sort, page: pageNumber, pageSize: pageSizeNumber }),
    getAllCategories("all"),
  ]);

  const catMap = new Map(categoriesList.map((category) => [category.id, category]));

  const formatted = rows.map((skill) => ({
    ...skill,
    category: skill.categoryId ? catMap.get(skill.categoryId) || null : null,
  }));

  const params = {
    q,
    status,
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
            Manajemen Skill AI Agent
          </h2>
          <p className="text-xs text-muted-foreground">
            Daftar seluruh skill dalam database. Status draft tidak ditampilkan di halaman publik.
          </p>
        </div>

        <Link
          href="/admin/skills/new"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Skill Baru</span>
        </Link>
      </div>

      <AdminListToolbar
        basePath={BASE_PATH}
        q={q}
        status={status}
        pageSize={pageSizeNumber}
        params={params}
        placeholder="Cari judul atau slug skill..."
        statusOptions={[
          { label: "Semua" },
          { label: "Terbit", value: "published" },
          { label: "Review", value: "pending" },
          { label: "Draft", value: "draft" },
          { label: "Arsip", value: "archived" },
        ]}
      />

      <SkillsTable
        skillsList={formatted}
        view={view === "list" ? "list" : "grid"}
        visibleColumns={visibleColumns}
        basePath={BASE_PATH}
        params={params}
      />

      <AdminPagination
        page={pageNumber}
        pageSize={pageSizeNumber}
        total={total}
        basePath={BASE_PATH}
        params={params}
      />
    </div>
  );
}
