"use client";

import * as React from "react";
import Image from "next/image";
import { Star, GitFork, Copy, Terminal, ExternalLink, QrCode } from "lucide-react";
import type { ShareItemData, SharePalette, ShareTheme } from "@/types/share";
import { PALETTE_CONFIGS, buildShareUrl, generateQrCodeDataUrl } from "@/lib/share-utils";
import { BrandLogo } from "@/components/brand-logo";

interface ShareCardProps {
  item: ShareItemData;
  theme: ShareTheme;
  palette: SharePalette;
  className?: string;
}

export function ShareCard({
  item,
  theme,
  palette,
  className = "",
}: ShareCardProps) {
  const isDark = theme === "dark";
  const p = PALETTE_CONFIGS[palette] || PALETTE_CONFIGS.zinc;
  const canonicalUrl = buildShareUrl(item.url);
  const [qrSrc, setQrSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    generateQrCodeDataUrl(canonicalUrl, "light").then((url) => {
      if (active) {
        setQrSrc(url);
      }
    });
    return () => {
      active = false;
    };
  }, [canonicalUrl]);

  const typeLabels: Record<string, string> = {
    skill: "AGENT SKILL",
    prompt: "PROMPT",
    repo: "TRENDING REPO",
    mcp: "MCP SERVER",
  };
  const typeLabel = typeLabels[item.type] || item.type.toUpperCase();

  const categoryName = item.category || (
    item.type === "skill"
      ? "Agent Skill"
      : item.type === "prompt"
      ? "Prompt Engineering"
      : item.type === "repo"
      ? "Open Source"
      : "Developer Tools"
  );

  const stats = item.stats && item.stats.length > 0
    ? item.stats
    : [
        { label: "Community", value: "Verified" },
        { label: "License", value: "Open Source" },
      ];

  const bgGradient = isDark ? p.darkGradient : p.lightGradient;
  const borderColor = isDark ? p.darkBorder : p.lightBorder;
  const badgeClass = isDark ? p.darkBadge : p.lightBadge;

  return (
    <div
      className={`relative w-full rounded-2xl border bg-gradient-to-br ${bgGradient} ${borderColor} p-4 sm:p-6 transition-all duration-300 shadow-xl overflow-hidden select-none ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      } ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? "#ffffff" : "#000000"} 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0 border ${
              isDark ? "bg-white text-zinc-950 border-white/20" : "bg-zinc-950 text-white border-zinc-950/20"
            } shadow-2xs`}>
              <span className="font-bold text-sm tracking-tight">P</span>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-tight block">
                ProSkillAI
              </span>
              <span className={`text-[10px] font-mono block ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                proskillai.dev
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-[5px] border ${badgeClass} shrink-0`}
          >
            {typeLabel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_120px] gap-4 items-center">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-[5px] border ${badgeClass}`}
              >
                {categoryName}
              </span>
              {item.author && (
                <span className={`text-[11px] font-medium truncate ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  by @{item.author.replace(/^@/, "")}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold tracking-tight line-clamp-2 leading-snug">
              {item.title}
            </h3>

            <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
              {item.description}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white text-zinc-950 border border-zinc-200/80 shadow-md shrink-0 w-28 mx-auto sm:mx-0">
            {qrSrc ? (
              <Image
                src={qrSrc}
                alt="QR Code"
                width={88}
                height={88}
                unoptimized
                className="w-22 h-22 object-contain"
              />
            ) : (
              <div className="w-22 h-22 flex items-center justify-center text-zinc-400">
                <QrCode className="w-8 h-8 animate-pulse" />
              </div>
            )}
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-800 mt-1">
              Scan to Open
            </span>
          </div>
        </div>

        <div className={`pt-3 border-t flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono ${
          isDark ? "border-white/10 text-zinc-400" : "border-zinc-300/80 text-zinc-600"
        }`}>
          <div className="flex items-center gap-1.5 flex-wrap">
            {stats.slice(0, 3).map((s, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-[4px] border ${
                  isDark ? "bg-white/5 border-white/10 text-zinc-300" : "bg-black/5 border-black/10 text-zinc-700"
                }`}
              >
                {s.label}: <strong className={isDark ? "text-white" : "text-zinc-900"}>{s.value}</strong>
              </span>
            ))}
          </div>

          <span className="text-[10px] font-semibold truncate max-w-[150px]">
            {canonicalUrl.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>
    </div>
  );
}
