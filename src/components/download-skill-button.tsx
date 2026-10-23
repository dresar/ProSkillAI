"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { trackSkillAction } from "@/app/actions/track";

export function DownloadSkillButton({
  skillId,
  content,
  filename = "SKILL.md",
  label = "Unduh .md",
  showLabel = true,
  className = "",
}: {
  skillId?: string;
  content: string;
  filename?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
}) {
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (skillId) {
      trackSkillAction(skillId, "download").catch(() => {});
    }
  };

  const defaultClass = showLabel
    ? "inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-medium border border-border bg-surface text-foreground hover:bg-muted transition-transform active:scale-95 cursor-pointer shadow-2xs"
    : "inline-flex items-center justify-center w-8 h-8 rounded-[6px] text-xs font-medium border border-border bg-surface text-foreground hover:bg-muted transition-transform active:scale-95 cursor-pointer shadow-2xs";

  return (
    <button
      type="button"
      onClick={handleDownload}
      title={label}
      aria-label={label}
      className={className || defaultClass}
    >
      <Download className="w-3.5 h-3.5" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
