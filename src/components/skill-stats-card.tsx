"use client";

import * as React from "react";
import {
  Star,
  GitFork,
  GitCommit,
  Users,
  Scale,
  Folder,
  FolderGit2,
  ExternalLink,
  GitBranch,
  FileCode,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import type { Skill, Category } from "@/db/schema";
import { formatIdNumber, formatIsoDate } from "@/lib/format";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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

export function SkillStatsCard({ skill, category, locale }: SkillStatsCardProps) {
  const isEn = locale === "en";
  const metrics = readRepoMetrics(skill);
  const categoryName = category ? (isEn ? category.nameEn : category.nameId) : null;
  const lastCommit = formatIsoDate(metrics.lastCommit) ?? formatIsoDate(skill.updatedAt);
  const repoPath = skill.repoUrl ? skill.repoUrl.replace(/^https?:\/\/github\.com\//, "") : null;
  const author = skill.authorName || (repoPath ? repoPath.split("/")[0] : "ProSkillAI");

  return (
    <motion.aside
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-border bg-surface overflow-hidden shadow-xs space-y-0"
    >
      <div className="p-3.5 border-b border-border/80 bg-muted/20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <GitHubIcon className="w-4 h-4 text-foreground shrink-0" />
          <span className="text-xs font-bold text-foreground tracking-tight truncate">
            {isEn ? "GitHub Repository" : "Repositori GitHub"}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shrink-0">
          Verified
        </span>
      </div>

      <div className="p-3.5 space-y-3">
        {repoPath && (
          <div className="p-2.5 rounded-[8px] border border-border/80 bg-background flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                {isEn ? "Source Repository" : "Repositori Sumber"}
              </span>
              <span className="text-xs font-mono font-semibold text-foreground truncate block">
                {repoPath}
              </span>
            </div>
            <a
              href={skill.repoUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] bg-foreground text-background text-[11px] font-medium hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer shadow-2xs"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-[8px] border border-border bg-background space-y-0.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{isEn ? "Stars" : "Bintang"}</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground tabular-nums">
              {typeof metrics.stars === "number" ? formatIdNumber(metrics.stars) : "-"}
            </div>
          </div>

          <div className="p-2.5 rounded-[8px] border border-border bg-background space-y-0.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
              <GitFork className="w-3.5 h-3.5 text-foreground" />
              <span>Forks</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground tabular-nums">
              {typeof metrics.forks === "number" ? formatIdNumber(metrics.forks) : "-"}
            </div>
          </div>

          <div className="p-2.5 rounded-[8px] border border-border bg-background space-y-0.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
              <Users className="w-3.5 h-3.5 text-foreground" />
              <span>{isEn ? "Contributors" : "Kontributor"}</span>
            </div>
            <div className="text-base font-bold font-mono text-foreground tabular-nums">
              {typeof metrics.contributors === "number" ? formatIdNumber(metrics.contributors) : "1"}
            </div>
          </div>

          <div className="p-2.5 rounded-[8px] border border-border bg-background space-y-0.5">
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-semibold tracking-wider">
              <Scale className="w-3.5 h-3.5 text-foreground" />
              <span>{isEn ? "License" : "Lisensi"}</span>
            </div>
            <div className="text-xs font-bold font-mono text-foreground truncate pt-0.5">
              {skill.license || "MIT"}
            </div>
          </div>
        </div>

        <div className="p-2.5 rounded-[8px] border border-border/80 bg-background divide-y divide-border/60 text-xs">
          {skill.branch && (
            <div className="flex items-center justify-between py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <GitBranch className="w-3 h-3 text-muted-foreground" />
                <span>Branch</span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-foreground">
                {skill.branch}
              </span>
            </div>
          )}

          {skill.commitHash && (
            <div className="flex items-center justify-between py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <GitCommit className="w-3 h-3 text-muted-foreground" />
                <span>Commit</span>
              </span>
              <span className="font-mono text-[11px] font-semibold text-foreground">
                {skill.commitHash.slice(0, 7)}
              </span>
            </div>
          )}

          {lastCommit && (
            <div className="flex items-center justify-between py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <GitCommit className="w-3 h-3 text-muted-foreground" />
                <span>{isEn ? "Last updated" : "Pembaruan"}</span>
              </span>
              <span className="font-mono text-[11px] text-foreground tabular-nums">
                {lastCommit}
              </span>
            </div>
          )}

          {skill.filePath && (
            <div className="flex items-center justify-between py-1.5 gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground shrink-0">
                <FileCode className="w-3 h-3 text-muted-foreground" />
                <span>{isEn ? "File path" : "Berkas"}</span>
              </span>
              <span className="font-mono text-[10px] text-foreground truncate max-w-[65%] text-right">
                {skill.filePath}
              </span>
            </div>
          )}

          {author && (
            <div className="flex items-center justify-between py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <User className="w-3 h-3 text-muted-foreground" />
                <span>{isEn ? "Author" : "Pembuat"}</span>
              </span>
              <span className="font-medium text-xs text-foreground truncate max-w-[60%] text-right">
                {author}
              </span>
            </div>
          )}

          {categoryName && (
            <div className="flex items-center justify-between py-1.5">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Folder className="w-3 h-3 text-muted-foreground" />
                <span>{isEn ? "Category" : "Kategori"}</span>
              </span>
              <span className="text-xs font-medium text-foreground truncate max-w-[60%] text-right">
                {categoryName}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}