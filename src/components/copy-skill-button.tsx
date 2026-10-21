"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { trackSkillAction } from "@/app/actions/track";

export function CopySkillButton({
  skillId,
  content,
  label = "Salin SKILL.md",
  copiedLabel = "Tersalin!",
}: {
  skillId?: string;
  content: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    if (skillId) {
      trackSkillAction(skillId, "copy").catch(() => {});
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded text-xs font-medium bg-foreground text-background hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
      aria-live="polite"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
