"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { trackSkillAction } from "@/app/actions/track";

export function DownloadSkillButton({
  skillId,
  content,
  filename = "SKILL.md",
  label = "Unduh .md",
}: {
  skillId?: string;
  content: string;
  filename?: string;
  label?: string;
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

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-surface text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-transform active:scale-95 cursor-pointer"
    >
      <Download className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}
