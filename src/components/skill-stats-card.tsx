import * as React from "react";
import { Star, GitFork, GitCommit, Users, Scale, Folder, FolderGit2, ExternalLink } from "lucide-react";
import type { Skill, Category } from "@/db/schema";
import { formatIdNumber, formatIsoDate } from "@/lib/format";

interface SkillStatsCardProps {
  skill: Skill;
  category?: Category | null;
  locale: string;
}

interface RepoMetrics {
  stars?: number;
  forks?: number;
  contributors?: number;
  lastCommit?: string | null;
}

function readRepoMetrics(skill: Skill): RepoMetrics {
  const fm = (skill.frontmatter ?? {}) as Record<string, unknown>;
  const num = (key: string): number | undefined => {
    const raw = fm[key];
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    if (typeof raw === "string" && raw.trim() !== "" && !Number.isNaN(Number(raw))) {
      return Number(raw);
    }
    return undefined;
  };
  const str = (key: string): string | null => {
    const raw = fm[key];
    return typeof raw === "string" && raw.trim() !== "" ? raw : null;
  };
  return {
    stars: num("stars"),
    forks: num("forks"),
    contributors: num("contributors"),
    lastCommit: str("lastCommit"),
  };
}

function MetricRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="text-muted-foreground/80">{icon}</span>
        {label}
      </span>
      <span className="text-xs font-semibold text-foreground tabular-nums text-right">{children}</span>
    </div>
  );
}

export function SkillStatsCard({ skill, category, locale }: SkillStatsCardProps) {
  const isEn = locale === "en";
  const metrics = readRepoMetrics(skill);
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;
  const lastCommit = formatIsoDate(metrics.lastCommit) ?? formatIsoDate(skill.updatedAt);
  const repoPath = skill.repoUrl ? skill.repoUrl.replace(/^https?:\/\/github\.com\//, "") : null;

  return (
    <aside className="rounded-xl border border-border/60 bg-surface overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-border/60 bg-muted/30">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {isEn ? "Statistics" : "Statistik"}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground/70 text-right">
          {isEn ? "Source repo · this path" : "Repositori sumber · jalur ini"}
        </span>
      </div>

      <div className="px-3.5 py-2 divide-y divide-border/40">
        {typeof metrics.stars === "number" && (
          <MetricRow icon={<Star className="w-3.5 h-3.5" />} label={isEn ? "Stars" : "Bintang"}>
            {formatIdNumber(metrics.stars)}
          </MetricRow>
        )}

        {typeof metrics.forks === "number" && (
          <MetricRow icon={<GitFork className="w-3.5 h-3.5" />} label={isEn ? "Forks" : "Garpu"}>
            {formatIdNumber(metrics.forks)}
          </MetricRow>
        )}

        {lastCommit && (
          <MetricRow icon={<GitCommit className="w-3.5 h-3.5" />} label={isEn ? "Last commit" : "Komit terakhir"}>
            {lastCommit}
          </MetricRow>
        )}

        {typeof metrics.contributors === "number" && (
          <MetricRow icon={<Users className="w-3.5 h-3.5" />} label={isEn ? "Contributors" : "Kontributor"}>
            {formatIdNumber(metrics.contributors)}
          </MetricRow>
        )}

        {skill.license && (
          <MetricRow icon={<Scale className="w-3.5 h-3.5" />} label={isEn ? "License" : "Lisensi"}>
            {skill.license}
          </MetricRow>
        )}

        {categoryName && (
          <MetricRow icon={<Folder className="w-3.5 h-3.5" />} label={isEn ? "Category" : "Kategori"}>
            {categoryName}
          </MetricRow>
        )}

        <div className="flex items-center justify-between gap-3 py-2.5">
          <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="text-muted-foreground/80">
              <FolderGit2 className="w-3.5 h-3.5" />
            </span>
            {isEn ? "Source" : "Sumber"}
          </span>
          {repoPath ? (
            <a
              href={skill.repoUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:underline max-w-[60%]"
            >
              <span className="truncate font-mono">{repoPath}</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <span className="text-xs font-semibold text-foreground">
              {isEn ? "Original" : "Orisinal"}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
