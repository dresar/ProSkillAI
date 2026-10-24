"use client";

import * as React from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface RepoCloneBoxProps {
  cloneUrl: string;
  fullName: string;
  locale: string;
}

export function RepoCloneBox({ cloneUrl, fullName, locale }: RepoCloneBoxProps) {
  const [copiedType, setCopiedType] = React.useState<"https" | "gh" | null>(null);
  const [activeTab, setActiveTab] = React.useState<"https" | "gh">("https");

  const isEn = locale === "en";
  const httpsCommand = `git clone ${cloneUrl}.git`;
  const ghCommand = `gh repo clone ${fullName}`;

  const currentCommand = activeTab === "https" ? httpsCommand : ghCommand;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopiedType(activeTab);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {}
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 space-y-2.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{isEn ? "Clone Repository" : "Clone Repositori"}</span>
        </div>
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-[5px] border border-border/60">
          <button
            type="button"
            onClick={() => setActiveTab("https")}
            className={`h-6 px-2 rounded-[4px] text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              activeTab === "https"
                ? "bg-surface text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            HTTPS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gh")}
            className={`h-6 px-2 rounded-[4px] text-[11px] font-mono font-medium transition-colors cursor-pointer ${
              activeTab === "gh"
                ? "bg-surface text-foreground shadow-2xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            GitHub CLI
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 p-2 rounded-[6px] bg-background border border-border/80 font-mono text-xs text-foreground">
        <span className="truncate select-all">{currentCommand}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={isEn ? "Copy clone command" : "Salin perintah clone"}
          className="h-7 px-2.5 rounded-[5px] border border-border bg-surface hover:bg-muted text-[11px] font-medium text-foreground inline-flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95"
        >
          {copiedType === activeTab ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">
                {isEn ? "Copied" : "Disalin"}
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{isEn ? "Copy" : "Salin"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
