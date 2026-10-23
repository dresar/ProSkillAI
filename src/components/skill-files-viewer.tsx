"use client";

import * as React from "react";
import { FileCode, Download, Check, Copy, Code } from "lucide-react";
import type { SkillFileItem } from "@/db/schema";

interface SkillFilesViewerProps {
  files: SkillFileItem[];
  locale?: string;
}

export function SkillFilesViewer({ files, locale }: SkillFilesViewerProps) {
  const isEn = locale === "en";
  const [activeId, setActiveId] = React.useState<string>(files[0]?.id || "");
  const [copied, setCopied] = React.useState(false);

  const activeFile = files.find((f) => f.id === activeId) || files[0];

  const handleCopy = async () => {
    if (!activeFile) return;
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!files || files.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs space-y-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {files.map((file) => {
            const isActive = file.id === (activeFile?.id || "");
            return (
              <button
                key={file.id}
                type="button"
                onClick={() => setActiveId(file.id)}
                className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-2xs"
                    : "bg-surface text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                }`}
              >
                <Code className="w-3 h-3" />
                <span className="truncate max-w-[130px]">{file.name}</span>
              </button>
            );
          })}
        </div>

        {activeFile && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono">
              {activeFile.language || "text"} • {Math.round((activeFile.size || activeFile.content.length) / 1024 * 10) / 10} KB
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? (isEn ? "Copied" : "Disalin") : (isEn ? "Copy" : "Salin")}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>{isEn ? "Download" : "Unduh"}</span>
            </button>
          </div>
        )}
      </div>

      {activeFile && (
        <pre className="p-4 sm:p-5 overflow-x-auto text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-words bg-background/50 max-h-[500px]">
          {activeFile.content}
        </pre>
      )}
    </div>
  );
}
