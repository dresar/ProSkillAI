"use client";

import * as React from "react";
import { Terminal, Copy, Check, ExternalLink } from "lucide-react";

interface PromptDemoOutputProps {
  demoOutput: string;
  isEn?: boolean;
  demoUrl?: string | null;
}

export function PromptDemoOutput({
  demoOutput,
  isEn = false,
  demoUrl,
}: PromptDemoOutputProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface space-y-3 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-foreground" />
          <h2 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
            {isEn ? "Demo Output Example" : "Contoh Hasil / Output Demo"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isEn ? "Open Live Demo URL" : "Buka Link Demo"}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-foreground bg-foreground text-background text-[11px] font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>{isEn ? "Live Demo" : "Link Demo"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleCopy}
            aria-label={isEn ? "Copy demo output" : "Salin contoh hasil"}
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-border bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {isEn ? "Copied" : "Tersalin"}
                </span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{isEn ? "Copy Output" : "Salin Hasil"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <pre className="w-full p-3.5 rounded-[6px] bg-background border border-border text-foreground font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[460px] overflow-y-auto selection:bg-foreground selection:text-background">
        {demoOutput}
      </pre>
    </div>
  );
}
