import { getAdminStats, getAdminActivityLogs } from "@/db/queries";
import Link from "next/link";
import { Layers, FileCode, Tag, Users as UsersIcon, Plus, DownloadCloud } from "lucide-react";

export default async function AdminOverviewPage() {
  const [stats, recentLogs] = await Promise.all([
    getAdminStats(),
    getAdminActivityLogs(5),
  ]);

  const totalSkills = stats.skills.draft + stats.skills.published + stats.skills.archived;
  const totalPrompts = stats.prompts.draft + stats.prompts.published + stats.prompts.archived;

  const statCards = [
    {
      label: "Total Skills",
      value: totalSkills,
      detail: `${stats.skills.published} terbit, ${stats.skills.draft} draft`,
      href: "/admin/skills",
      icon: Layers,
    },
    {
      label: "Total Prompts",
      value: totalPrompts,
      detail: `${stats.prompts.published} terbit, ${stats.prompts.draft} draft`,
      href: "/admin/prompts",
      icon: FileCode,
    },
    {
      label: "Kategori",
      value: stats.totalCategories,
      detail: "Kategori terdaftar",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      label: "Pengguna",
      value: stats.totalUsers,
      detail: "Staf & editor terdaftar",
      href: "/admin/users",
      icon: UsersIcon,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Ringkasan Sistem
          </h2>
          <p className="text-xs text-neutral-500">
            Metrik data riil dari database Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/github-import"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium border border-border bg-surface hover:bg-muted text-foreground transition-transform active:scale-95"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Impor GitHub</span>
          </Link>
          <Link
            href="/admin/skills/new"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Skill</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="p-3 sm:p-4 rounded-xl border border-border bg-surface hover:border-foreground/30 transition-colors block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium truncate">{c.label}</span>
                <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
                {c.value}
              </div>
              <div className="mt-1 text-[10px] sm:text-[11px] text-muted-foreground truncate">{c.detail}</div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 rounded-md border border-border bg-surface space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground tracking-tight">
            Log Aktivitas Terbaru
          </h3>
          <Link
            href="/admin/activity"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Lihat semua
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted-foreground">
            Belum ada aktivitas tercatat di audit log.
          </div>
        ) : (
          <div className="divide-y divide-border text-xs">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between flex-wrap gap-2">
                <div className="space-x-2">
                  <span className="font-mono text-[11px] font-semibold text-foreground">
                    {log.action}
                  </span>
                  <span className="text-muted-foreground">
                    oleh {log.userEmail || "Sistem"}
                  </span>
                  {log.entityType && (
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-foreground font-mono border border-border">
                      {log.entityType}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
