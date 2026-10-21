import { db } from "@/db";
import { skills, prompts, categories, users, auditLog } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import Link from "next/link";
import { Layers, FileCode, Tag, Users as UsersIcon, Plus, DownloadCloud } from "lucide-react";

export default async function AdminOverviewPage() {
  const [skillStats] = await db
    .select({
      total: sql<number>`count(*)`,
      published: sql<number>`count(*) filter (where ${skills.status} = 'published')`,
      draft: sql<number>`count(*) filter (where ${skills.status} = 'draft')`,
    })
    .from(skills);

  const [promptStats] = await db
    .select({
      total: sql<number>`count(*)`,
      published: sql<number>`count(*) filter (where ${prompts.status} = 'published')`,
      draft: sql<number>`count(*) filter (where ${prompts.status} = 'draft')`,
    })
    .from(prompts);

  const [catStats] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(categories);

  const [userStats] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(users);

  const recentLogs = await db
    .select()
    .from(auditLog)
    .orderBy(desc(auditLog.createdAt))
    .limit(5);

  const statCards = [
    {
      label: "Total Skills",
      value: Number(skillStats?.total || 0),
      detail: `${Number(skillStats?.published || 0)} terbit, ${Number(skillStats?.draft || 0)} draft`,
      href: "/admin/skills",
      icon: Layers,
    },
    {
      label: "Total Prompts",
      value: Number(promptStats?.total || 0),
      detail: `${Number(promptStats?.published || 0)} terbit, ${Number(promptStats?.draft || 0)} draft`,
      href: "/admin/prompts",
      icon: FileCode,
    },
    {
      label: "Kategori",
      value: Number(catStats?.total || 0),
      detail: "Kategori terdaftar",
      href: "/admin/categories",
      icon: Tag,
    },
    {
      label: "Pengguna",
      value: Number(userStats?.total || 0),
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
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-surface hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground transition-transform active:scale-95"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors block"
            >
              <div className="flex items-center justify-between text-neutral-500 mb-2">
                <span className="text-xs font-medium">{c.label}</span>
                <Icon className="w-4 h-4 text-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">
                {c.value}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                {c.detail}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface">
        <h3 className="text-xs font-semibold text-foreground mb-3 tracking-tight">
          Aktivitas Terbaru
        </h3>
        {recentLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-400">
            Belum ada aktivitas tercatat di log audit.
          </div>
        ) : (
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs py-2 border-b border-neutral-100 dark:border-neutral-800/60 last:border-0"
              >
                <div>
                  <span className="font-medium text-foreground">{log.action}</span>
                  <span className="text-neutral-500 ml-1.5">
                    ({log.entityType}: {log.entityId || "N/A"})
                  </span>
                </div>
                <div className="text-neutral-400 text-[11px] font-mono">
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
