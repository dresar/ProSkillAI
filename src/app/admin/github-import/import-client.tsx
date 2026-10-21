"use client";

import * as React from "react";
import { scanGitHubRepoAction, importCandidateAction } from "./actions";
import { DownloadCloud, Check, AlertCircle, FileText, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import type { GitHubRepoInfo, SkillCandidate } from "@/lib/github";

interface ScanResult {
  repoInfo: GitHubRepoInfo;
  candidates: SkillCandidate[];
}

export function GitHubImportClient() {
  const [repoInput, setRepoInput] = React.useState("dresar/antigravity");
  const [isScanning, setIsScanning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [importingPath, setImportingPath] = React.useState<string | null>(null);
  const [importedSkills, setImportedSkills] = React.useState<Record<string, string>>({});

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoInput.trim()) return;
    setIsScanning(true);
    setError(null);
    setScanResult(null);

    const res = await scanGitHubRepoAction(repoInput.trim());
    setIsScanning(false);

    if (!res.success) {
      setError(res.error || "Gagal memindai repositori.");
    } else {
      setScanResult({
        repoInfo: res.repoInfo,
        candidates: res.candidates,
      });
    }
  };

  const handleImport = async (candidate: SkillCandidate) => {
    if (!scanResult?.repoInfo) return;
    setImportingPath(candidate.path);
    setError(null);

    try {
      const res = await importCandidateAction({
        repoInfo: scanResult.repoInfo,
        candidate,
      });

      if (res.success && res.skillId) {
        setImportedSkills((prev) => ({
          ...prev,
          [candidate.path]: res.skillId,
        }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal mengimpor skill.");
    } finally {
      setImportingPath(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface">
        <form onSubmit={handleScan} className="space-y-3">
          <label
            htmlFor="github-repo"
            className="block text-xs font-semibold text-foreground tracking-tight"
          >
            URL Repositori GitHub atau format owner/repo
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="github-repo"
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="e.g. owner/repo atau https://github.com/owner/repo"
              disabled={isScanning}
              className="flex-1 h-9 px-3 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-background text-foreground focus:outline-2 focus:outline-foreground"
            />
            <button
              type="submit"
              disabled={isScanning || !repoInput.trim()}
              className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <DownloadCloud className="w-3.5 h-3.5" />
                  <span>Pindai Repositori</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-neutral-500">
            Server akan membaca git tree secara rekursif untuk menemukan seluruh file SKILL.md dan mem-parse frontmatter YAML.
          </p>
        </form>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-foreground text-xs flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-foreground" />
          <span>{error}</span>
        </div>
      )}

      {scanResult && (
        <div className="space-y-4">
          <div className="p-3.5 rounded border border-border bg-muted/40 text-xs space-y-1">
            <div className="font-semibold text-foreground">
              {scanResult.repoInfo.owner} / {scanResult.repoInfo.repo}
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-3 text-[11px]">
              <span>Branch: <span className="font-mono text-foreground">{scanResult.repoInfo.defaultBranch}</span></span>
              <span>&bull;</span>
              <span>
                Lisensi:{" "}
                <span className="font-semibold text-foreground">
                  {scanResult.repoInfo.licenseSpdx || "Tidak Terdeteksi"}
                </span>
              </span>
              <span>&bull;</span>
              <span>Ditemukan {scanResult.candidates.length} kandidat skill</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-foreground tracking-tight">
              Kandidat File SKILL.md
            </h3>

            {scanResult.candidates.map((cand: SkillCandidate) => {
              const alreadyImportedId = importedSkills[cand.path];
              const isImporting = importingPath === cand.path;

              return (
                <div
                  key={cand.path}
                  className="p-4 rounded-md border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="font-semibold text-foreground">{cand.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          cand.isPermissive
                            ? "border-border bg-muted text-foreground"
                            : "border-border border-dashed text-muted-foreground"
                        }`}
                      >
                        {cand.isPermissive
                          ? `${cand.licenseSpdx} (Konten Penuh)`
                          : "Non-Permissive (Metadata Saja)"}
                      </span>
                    </div>

                    <div className="text-muted-foreground text-[11px] font-mono truncate">
                      {cand.path}
                    </div>

                    <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                      {cand.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {alreadyImportedId ? (
                      <Link
                        href={`/admin/skills/${alreadyImportedId}/edit`}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium border border-border bg-surface hover:bg-muted text-foreground transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Edit Draft</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled={isImporting}
                        onClick={() => handleImport(cand)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        {isImporting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Mengimpor...</span>
                          </>
                        ) : (
                          <>
                            <DownloadCloud className="w-3.5 h-3.5" />
                            <span>Impor sebagai Draft</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
