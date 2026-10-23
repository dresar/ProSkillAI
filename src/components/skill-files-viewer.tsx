"use client";

import * as React from "react";
import {
  FileCode,
  Download,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import type { SkillFileItem } from "@/db/schema";

interface SkillFilesViewerProps {
  files: SkillFileItem[];
  locale?: string;
}

export function SkillFilesViewer({ files, locale }: SkillFilesViewerProps) {
  const isEn = locale === "en";
  const [activeId, setActiveId] = React.useState<string>(files[0]?.id || "");
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const activeFile = files.find((f) => f.id === activeId) || files[0];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

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

  const fileSizeKb = activeFile
    ? Math.round(((activeFile.size || activeFile.content.length) / 1024) * 10) / 10
    : 0;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs space-y-0">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 flex-wrap gap-2">
        <div className="relative inline-flex items-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-haspopup="listbox"
            className="inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-mono font-medium text-foreground transition-all cursor-pointer shadow-2xs active:scale-95 select-none"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold truncate max-w-[180px] sm:max-w-[260px]">
              {activeFile?.name || "Select file"}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.2 rounded bg-muted">
              {fileSizeKb} KB
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              aria-label="Files list"
              className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl border border-border bg-surface/98 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-0.5 max-h-72 overflow-y-auto"
            >
              {files.map((file) => {
                const isActive = file.id === (activeFile?.id || "");
                const kb = Math.round(((file.size || file.content.length) / 1024) * 10) / 10;
                return (
                  <button
                    key={file.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveId(file.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition-colors cursor-pointer ${
                      isActive
                        ? "bg-foreground text-background font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-background" : "text-blue-500"}`} />
                      <span className="truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] ${isActive ? "text-background/80" : "text-muted-foreground"}`}>
                        {kb} KB
                      </span>
                      {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {activeFile && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              title={isEn ? "Copy file content" : "Salin isi berkas"}
              aria-label={isEn ? "Copy file content" : "Salin isi berkas"}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isEn ? "Copied" : "Disalin") : (isEn ? "Copy" : "Salin")}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              title={isEn ? "Download file" : "Unduh berkas"}
              aria-label={isEn ? "Download file" : "Unduh berkas"}
              className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-background hover:bg-muted text-xs font-medium text-foreground transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
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
