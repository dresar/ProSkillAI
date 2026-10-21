import { db } from "@/db";
import { skills, categories } from "@/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SkillsTable } from "./skills-table";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
}

export default async function AdminSkillsPage({ searchParams }: PageProps) {
  const { q, status } = await searchParams;

  const conditions = [];
  if (status && ["draft", "published", "archived"].includes(status)) {
    conditions.push(eq(skills.status, status));
  }
  if (q) {
    conditions.push(
      sql`(${skills.titleId} ILIKE ${`%${q}%`} OR ${skills.titleEn} ILIKE ${`%${q}%`} OR ${skills.slug} ILIKE ${`%${q}%`})`
    );
  }

  const allSkills = await db
    .select({
      skill: skills,
      category: categories,
    })
    .from(skills)
    .leftJoin(categories, eq(skills.categoryId, categories.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(skills.createdAt));

  const formatted = allSkills.map((item) => ({
    ...item.skill,
    category: item.category,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Manajemen Skill AI Agent
          </h2>
          <p className="text-xs text-neutral-500">
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

      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href="/admin/skills"
          className={`px-2.5 py-1 text-xs rounded border ${
            !status
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Semua
        </Link>
        <Link
          href="/admin/skills?status=published"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "published"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Terbit
        </Link>
        <Link
          href="/admin/skills?status=draft"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "draft"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Draft
        </Link>
        <Link
          href="/admin/skills?status=archived"
          className={`px-2.5 py-1 text-xs rounded border ${
            status === "archived"
              ? "border-foreground bg-foreground text-background"
              : "border-neutral-300 dark:border-neutral-700 bg-surface text-foreground"
          }`}
        >
          Arsip
        </Link>
      </div>

      <SkillsTable skillsList={formatted} />
    </div>
  );
}
