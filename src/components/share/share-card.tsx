"use client";

import * as React from "react";
import Image from "next/image";
import { QrCode, User as UserIcon } from "lucide-react";
import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import {
  PALETTE_CONFIGS,
  SITE_URL,
  buildShareUrl,
  generateQrCodeDataUrl,
} from "@/lib/share-utils";

interface ShareCardProps {
  item: ShareItemData;
  theme: ShareTheme;
  palette?: SharePalette;
  aspectRatio?: ShareAspectRatio;
  userAttribution?: ShareUserAttribution;
  className?: string;
}

export function ShareCard({
  item,
  theme,
  palette = "zinc",
  aspectRatio = "16:9",
  userAttribution,
  className = "",
}: ShareCardProps) {
  const isDark = theme === "dark";
  const p = PALETTE_CONFIGS[palette] || PALETTE_CONFIGS.zinc;
  const canonicalUrl = buildShareUrl(item.url);
  const [qrSrc, setQrSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    generateQrCodeDataUrl(canonicalUrl, theme).then((url) => {
      if (active) {
        setQrSrc(url);
      }
    });
    return () => {
      active = false;
    };
  }, [canonicalUrl, theme]);

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

  const isVertical = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";

  const rootDomain = "proskillai.dev";

  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  const displayUsername = userAttribution?.username || "";

  return (
    <div
      className={`relative w-full rounded-2xl border bg-gradient-to-br ${bgGradient} ${borderColor} p-4 sm:p-6 transition-all duration-300 shadow-xl overflow-hidden select-none flex flex-col justify-between ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-[7px] flex items-center justify-center shrink-0 border ${
              isDark
                ? "bg-white text-zinc-950 border-white/20"
                : "bg-zinc-950 text-white border-zinc-950/20"
            } shadow-2xs`}
          >
            <span className="font-bold text-sm tracking-tight">P</span>
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-tight block">
              ProSkillAI
            </span>
            <span
              className={`text-[10px] font-mono block ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {rootDomain}
            </span>
          </div>
        </div>

        {showUserBadge ? (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium shrink-0 ${
              isDark
                ? "bg-blue-950/40 border-blue-500/30 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center uppercase">
              {displayUsername.charAt(0) || "U"}
            </span>
            <span className="font-semibold tracking-tight">
              @{displayUsername}
            </span>
          </div>
        ) : (
          <span
            className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-[5px] border ${badgeClass} shrink-0`}
          >
            {typeLabel}
          </span>
        )}
      </div>

      <div
        className={`my-auto py-3 ${
          isVertical
            ? "flex flex-col items-center text-center gap-4"
            : isSquare
            ? "flex flex-col gap-4"
            : "grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_120px] gap-4 items-center"
        }`}
      >
        <div className={`space-y-2 min-w-0 ${isVertical ? "flex flex-col items-center" : ""}`}>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span
              className={`text-[11px] font-semibold tracking-tight px-2 py-0.5 rounded-[5px] border ${badgeClass}`}
            >
              {categoryName}
            </span>
            {item.author && (
              <span
                className={`text-[11px] font-medium truncate ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                by @{item.author.replace(/^@/, "")}
              </span>
            )}
          </div>

          <h3
            className={`font-bold tracking-tight leading-snug ${
              isVertical
                ? "text-base sm:text-lg max-w-xs"
                : "text-sm sm:text-base line-clamp-2"
            }`}
          >
            {item.title}
          </h3>

          <p
            className={`text-xs leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            } ${
              isVertical ? "max-w-xs line-clamp-3" : "line-clamp-2"
            }`}
          >
            {item.description || ""}
          </p>

          {isVertical && (
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
              {stats.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-[4px] border text-[10px] font-mono ${
                    isDark
                      ? "bg-white/5 border-white/10 text-zinc-300"
                      : "bg-black/5 border-black/10 text-zinc-700"
                  }`}
                >
                  {s.label}: <strong>{s.value}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center p-2 rounded-xl border shadow-md shrink-0 w-28 ${
            isVertical ? "mx-auto" : isSquare ? "mx-auto sm:ml-auto" : "mx-auto sm:mx-0"
          } ${
            isDark
              ? "bg-zinc-950 text-zinc-100 border-zinc-800"
              : "bg-white text-zinc-950 border-zinc-200/80"
          }`}
        >
          {qrSrc ? (
            <Image
              src={qrSrc}
              alt="QR Code"
              width={88}
              height={88}
              unoptimized
              className="w-22 h-22 object-contain rounded-md"
            />
          ) : (
            <div className="w-22 h-22 flex items-center justify-center text-zinc-400">
              <QrCode className="w-8 h-8 animate-pulse" />
            </div>
          )}
          <span
            className={`text-[9px] font-mono font-bold uppercase tracking-wider mt-1 ${
              isDark ? "text-zinc-400" : "text-zinc-800"
            }`}
          >
            Scan to Open
          </span>
        </div>
      </div>

      <div
        className={`pt-3 border-t flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono ${
          isDark
            ? "border-white/10 text-zinc-400"
            : "border-zinc-300/80 text-zinc-600"
        }`}
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          {!isVertical &&
            stats.slice(0, 3).map((s, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-[4px] border ${
                  isDark
                    ? "bg-white/5 border-white/10 text-zinc-300"
                    : "bg-black/5 border-black/10 text-zinc-700"
                }`}
              >
                {s.label}: <strong className={isDark ? "text-white" : "text-zinc-900"}>{s.value}</strong>
              </span>
            ))}
        </div>

        <span className="text-[10px] font-semibold text-blue-500 dark:text-blue-400">
          {rootDomain}
        </span>
      </div>
    </div>
  );
}
