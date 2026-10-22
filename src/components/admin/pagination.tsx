import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  params: Record<string, string | undefined>;
}

function buildHref(
  basePath: string,
  params: Record<string, string | undefined>,
  target: number
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, value);
  }
  search.set("page", String(target));
  return `${basePath}?${search.toString()}`;
}

function pageNumbers(current: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, current - 1, current, current + 1]);
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];
  for (let index = 0; index < sorted.length; index += 1) {
    if (index > 0 && sorted[index] - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[index]);
  }
  return result;
}

export function AdminPagination({ page, pageSize, total, basePath, params }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
      <p className="text-[11px] text-muted-foreground">
        Menampilkan {start}&ndash;{end} dari {total} data
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        {current > 1 ? (
          <Link
            href={buildHref(basePath, params, current - 1)}
            className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11px]"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Sebelumnya</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-surface text-[11px] text-muted-foreground opacity-50">
            <ChevronLeft className="w-3 h-3" />
            <span>Sebelumnya</span>
          </span>
        )}

        {pageNumbers(current, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-[11px] text-muted-foreground">
              &hellip;
            </span>
          ) : item === current ? (
            <span
              key={item}
              className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded border border-foreground bg-foreground text-background text-[11px] font-medium"
            >
              {item}
            </span>
          ) : (
            <Link
              key={item}
              href={buildHref(basePath, params, item)}
              className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11px]"
            >
              {item}
            </Link>
          )
        )}

        {current < totalPages ? (
          <Link
            href={buildHref(basePath, params, current + 1)}
            className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-surface hover:bg-muted text-[11px]"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-surface text-[11px] text-muted-foreground opacity-50">
            <span>Berikutnya</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </nav>
    </div>
  );
}
