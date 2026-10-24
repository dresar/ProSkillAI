import { getAdminStats, getAdminActivityLogs } from "@/db/queries";
import Link from "next/link";
import {
  Layers,
  FileCode,
  Tag,
  Users as UsersIcon,
  Plus,
  DownloadCloud,
  Palette,
  Image as ImageIcon,
  Bot,
  Settings,
  Shield,
  ArrowRight,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const [stats, recentLogs] = await Promise.all([
    getAdminStats(),
    getAdminActivityLogs(5),
  ]);

  const totalSkills = stats.skills.draft + stats.skills.published + stats.skills.archived;
  const totalPrompts = stats.prompts.draft + stats.prompts.published + stats.prompts.archived;

  const statCards = [
    {
      label: "Skills",
      value: totalSkills,
      detail: `${stats.skills.published} terbit · ${stats.skills.draft} draf`,
      href: "/admin/skills",
      icon: Layers,
    },
    {
      label: "Prompts",
      value: totalPrompts,
      detail: `${stats.prompts.published} terbit · ${stats.prompts.draft} draf`,
      href: "/admin/prompts",
      icon: FileCode,
    },
    {
      label: "Design Trends",
      value: stats.uiInspirations.total,
      detail: `${stats.uiInspirations.published} terbit · ${stats.uiInspirations.draft} draf`,
      href: "/admin/design-trends",
      icon: Palette,
    },
    {
      label: "Kategori & Staf",
      value: stats.totalCategories,
      detail: `${stats.totalCategories} kategori · ${stats.totalUsers} staf`,
      href: "/admin/categories",
      icon: Tag,
    },
  ];

  const quickNav = [
    { label: "Pustaka Media", href: "/admin/media", icon: ImageIcon },
    { label: "Konfigurasi AI", href: "/admin/ai", icon: Bot },
    { label: "Pengguna & Staf", href: "/admin/users", icon: UsersIcon },
    { label: "Pengaturan Sistem", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Ringkasan Sistem
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Metrik data riil direktori Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-medium border border-border bg-surface hover:bg-muted text-foreground transition-all active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Media</span>
          </Link>
          <Link
            href="/admin/github-import"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-medium border border-border bg-surface hover:bg-muted text-foreground transition-all active:scale-95"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Impor</span>
          </Link>
          <Link
            href="/admin/skills/new"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-[6px] text-xs font-semibold bg-foreground text-background hover:opacity-90 transition-all active:scale-95 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Skill</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group p-4 rounded-[8px] border border-border bg-surface hover:border-foreground/30 hover:shadow-xs transition-all duration-200 block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium truncate group-hover:text-foreground transition-colors">
                  {c.label}
                </span>
                <Icon className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-mono">
                {c.value}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground truncate">{c.detail}</div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="p-3 rounded-[8px] border border-border bg-surface hover:bg-muted/40 transition-colors flex items-center justify-between text-xs font-medium text-foreground"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span>{item.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <div className="p-4 sm:p-5 rounded-[8px] border border-border bg-surface space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-xs font-semibold text-foreground tracking-tight uppercase">
            Log Aktivitas Terbaru
          </h3>
          <Link
            href="/admin/activity"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Lihat semua &rarr;
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
