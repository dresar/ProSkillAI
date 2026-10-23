"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { ProviderLogo, type ProviderId } from "./provider-logos";

interface CliInstallBoxProps {
  slug: string;
  locale: string;
}

type CliTarget = {
  id: string;
  provider: ProviderId;
  label: string;
  command: (slug: string) => string;
};

export function CliInstallBox({ slug, locale }: CliInstallBoxProps) {
  const isEn = locale === "en";
  const [activeId, setActiveId] = React.useState("cmdc");
  const [copied, setCopied] = React.useState(false);

  const targets: CliTarget[] = [
    {
      id: "cmdc",
      provider: "cmdc",
      label: "Command Code",
      command: (s) => `cmdc --skill ${s}`,
    },
    {
      id: "claude",
      provider: "claude",
      label: "Claude Code",
      command: (s) => `claude --skill ${s}`,
    },
    {
      id: "cursor",
      provider: "cursor",
      label: isEn ? "Cursor / Antigravity" : "Cursor / Antigravity",
      command: (s) => `cp SKILL.md .agents/skills/${s}/SKILL.md`,
    },
  ];

  const active = targets.find((t) => t.id === activeId) ?? targets[0];
  const command = active.command(slug);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/60 bg-muted/30">
        <Terminal className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {isEn ? "Install via AI CLI" : "Pasang via AI CLI"}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={isEn ? "AI assistant" : "Asisten AI"}
        className="flex items-center gap-1 px-2 pt-2"
      >
        {targets.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeId === t.id}
            onClick={() => {
              setActiveId(t.id);
              setCopied(false);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              activeId === t.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <ProviderLogo provider={t.provider} className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="p-2">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-2.5 py-2">
          <code className="font-mono text-[11px] text-foreground truncate">{command}</code>
          <button
            type="button"
            onClick={handleCopy}
            aria-live="polite"
            aria-label={isEn ? "Copy command" : "Salin perintah"}
            className="inline-flex items-center gap-1 shrink-0 rounded border border-border px-2 py-1 text-[11px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? (isEn ? "Copied" : "Tersalin") : isEn ? "Copy" : "Salin"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
