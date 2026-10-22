"use client";

import * as React from "react";
import { AlertCircle, Check, ChevronDown, GitBranch, Loader2 } from "lucide-react";
import {
  scanGitHubForFormAction,
  type GitHubFormCandidate,
  type GitHubFormRepo,
} from "@/app/admin/skills/github-actions";

interface GitHubImportPanelProps {
  onSelect: (candidate: GitHubFormCandidate, repo: GitHubFormRepo) => void;
}

export function GitHubImportPanel({ onSelect }: GitHubImportPanelProps) {
  const [open, setOpen] = React.useState(false);
  const [repoInput, setRepoInput] = React.useState("");
  const [scanning, setScanning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [candidates, setCandidates] = React.useState<GitHubFormCandidate[]>([]);
  const [repo, setRepo] = React.useState<GitHubFormRepo | null>(null);
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null);

  const scan = async () => {
    const input = repoInput.trim();
    if (!input) {
      setError("Masukkan URL GitHub atau format owner/repo.");
      return;
    }

    setScanning(true);
    setError(null);
    setCandidates([]);
    setRepo(null);
    setSelectedPath(null);

    const result = await scanGitHubForFormAction(input);

    setScanning(false);
    if (result.repo) setRepo(result.repo);
    if (result.candidates) setCandidates(result.candidates);
    if (result.error) setError(result.error);
  };

  const choose = (candidate: GitHubFormCandidate) => {
    if (!repo) return;
    setSelectedPath(candidate.path);
    onSelect(candidate, repo);
  };

  return (
    <div className="rounded-md border border-border bg-surface">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 p-3 text-xs cursor-pointer"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 font-semibold text-foreground">
          <GitBranch className="w-4 h-4" />
          <span>Impor &amp; Isi Otomatis dari GitHub</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={repoInput}
              onChange={(event) => setRepoInput(event.target.value)}
              placeholder="https://github.com/owner/repo atau owner/repo"
              className="flex-1 h-8 px-2.5 text-xs rounded border border-border bg-background text-foreground focus:outline-2 focus:outline-foreground"
            />
            <button
              type="button"
              onClick={scan}
              disabled={scanning}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {scanning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <GitBranch className="w-3.5 h-3.5" />
              )}
              <span>{scanning ? "Memindai..." : "Pindai Repo"}</span>
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-2 rounded border border-border bg-muted text-[11px] text-foreground">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {repo && (
            <div className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">
                {repo.owner}/{repo.repo}
              </span>
              <span> &middot; branch {repo.defaultBranch}</span>
              {repo.licenseSpdx && <span> &middot; lisensi {repo.licenseSpdx}</span>}
            </div>
          )}

          {candidates.length > 0 && (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {candidates.map((candidate) => {
                const selected = selectedPath === candidate.path;
                return (
                  <button
                    key={candidate.path}
                    type="button"
                    onClick={() => choose(candidate)}
                    className={`w-full text-left p-2 rounded border transition-colors cursor-pointer ${
                      selected
                        ? "border-foreground bg-muted"
                        : "border-border bg-background hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {candidate.name}
                      </span>
                      {selected ? (
                        <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          Gunakan
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground truncate">
                      {candidate.path}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                      {candidate.description}
                    </div>
                    {!candidate.isPermissive && (
                      <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                        Lisensi tidak permisif &mdash; periksa ulang sebelum menerbitkan.
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Memilih kandidat akan mengisi judul, ringkasan, konten, slug, repo, branch, path,
            lisensi, dan penulis. Anda tetap dapat mengubahnya secara manual.
          </p>
        </div>
      )}
    </div>
  );
}
