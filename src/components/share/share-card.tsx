"use client";

import * as React from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import {
  PALETTE_CONFIGS,
  buildShareUrl,
  generateQrCodeDataUrl,
  getCurrentDomain,
} from "@/lib/share-utils";

interface ShareCardProps {
  item: ShareItemData;
  theme: ShareTheme;
  palette?: SharePalette;
  aspectRatio?: ShareAspectRatio;
  userAttribution?: ShareUserAttribution;
  domain?: string;
  className?: string;
}

export function ShareCard({
  item,
  theme,
  palette = "zinc",
  aspectRatio = "16:9",
  userAttribution,
  domain,
  className = "",
}: ShareCardProps) {
  const isDark = theme === "dark";
  const p = PALETTE_CONFIGS[palette] || PALETTE_CONFIGS.zinc;
  const canonicalUrl = buildShareUrl(item.url);
  const [qrSrc, setQrSrc] = React.useState<string | null>(null);

  const displayDomain = domain || getCurrentDomain();

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

  const isStory = aspectRatio === "9:16";
  const isPortrait = aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const isVertical = isStory || isPortrait;

  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  const displayUsername = userAttribution?.username || "";

  return (
    <div
      className={`relative w-full rounded-2xl border bg-gradient-to-br ${bgGradient} ${borderColor} ${
        isStory ? "p-3 sm:p-4.5" : isSquare ? "p-3.5 sm:p-5" : "p-4 sm:p-6"
      } transition-all duration-300 shadow-xl overflow-hidden select-none flex flex-col justify-between ${
        isDark ? "text-zinc-100" : "text-zinc-900"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 relative shrink-0">
            <Image
              src={isDark ? "/brand/logo-mark-white.png" : "/brand/logo-mark-black.png"}
              alt="Skills Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="leading-tight">
            <span className="text-xs sm:text-sm font-bold tracking-tight block">
              Skills
            </span>
            <span
              className={`text-[9px] sm:text-[10px] font-mono block ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {displayDomain}
            </span>
          </div>
        </div>

        {showUserBadge ? (
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-medium shrink-0 ${
              isDark
                ? "bg-blue-950/40 border-blue-500/30 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-900"
            }`}
          >
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-500 text-white text-[8px] sm:text-[9px] font-bold flex items-center justify-center uppercase">
              {displayUsername.charAt(0) || "U"}
            </span>
            <span className="font-semibold tracking-tight">
              @{displayUsername}
            </span>
          </div>
        ) : (
          <span
            className={`text-[9px] sm:text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded-[5px] border ${badgeClass} shrink-0`}
          >
            {typeLabel}
          </span>
        )}
      </div>

      <div
        className={`my-auto py-2 ${
          isVertical
            ? "flex flex-col items-center text-center gap-2 sm:gap-3"
            : isSquare
            ? "flex flex-col gap-2.5"
            : "grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_110px] gap-3 sm:gap-4 items-center"
        }`}
      >
        <div className={`space-y-1.5 min-w-0 ${isVertical ? "flex flex-col items-center" : ""}`}>
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span
              className={`text-[10px] sm:text-[11px] font-semibold tracking-tight px-1.5 py-0.5 rounded-[4px] border ${badgeClass}`}
            >
              {categoryName}
            </span>
            {item.author && (
              <span
                className={`text-[10px] sm:text-[11px] font-medium truncate ${
                  isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                by @{item.author.replace(/^@/, "")}
              </span>
            )}
          </div>

          <h3
            className={`font-bold tracking-tight leading-snug ${
              isStory
                ? "text-xs sm:text-sm line-clamp-2 max-w-[220px]"
                : isPortrait
                ? "text-sm sm:text-base line-clamp-3 max-w-[240px]"
                : isSquare
                ? "text-xs sm:text-sm line-clamp-2"
                : "text-sm sm:text-base line-clamp-2"
            }`}
          >
            {item.title}
          </h3>

          <p
            className={`text-[10px] sm:text-xs leading-relaxed ${
              isDark ? "text-zinc-300" : "text-zinc-600"
            } ${
              isStory
                ? "max-w-[210px] line-clamp-2"
                : isPortrait
                ? "max-w-[230px] line-clamp-3"
                : isSquare
                ? "line-clamp-2"
                : "line-clamp-2"
            }`}
          >
            {item.description || ""}
          </p>

          {isVertical && (
            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap justify-center">
              {stats.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded-[4px] border text-[9px] font-mono ${
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

        {isSquare ? (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <div className="flex items-center gap-1 flex-wrap">
              {stats.slice(0, 2).map((s, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded-[4px] border text-[9px] font-mono ${
                    isDark
                      ? "bg-white/5 border-white/10 text-zinc-300"
                      : "bg-black/5 border-black/10 text-zinc-700"
                  }`}
                >
                  {s.label}: <strong>{s.value}</strong>
                </span>
              ))}
            </div>

            <div
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border shadow-xs shrink-0 ${
                isDark
                  ? "bg-zinc-950 text-zinc-100 border-zinc-800"
                  : "bg-white text-zinc-950 border-zinc-200/80"
              }`}
            >
              {qrSrc ? (
                <Image
                  src={qrSrc}
                  alt="QR Code"
                  width={56}
                  height={56}
                  unoptimized
                  className="w-14 h-14 object-contain rounded-xs"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center text-zinc-400">
                  <QrCode className="w-6 h-6 animate-pulse" />
                </div>
              )}
              <span
                className={`text-[7px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                  isDark ? "text-zinc-400" : "text-zinc-800"
                }`}
              >
                Scan to Open
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl border shadow-md shrink-0 ${
              isVertical ? "w-20 sm:w-24 mx-auto" : "w-22 sm:w-26 mx-auto sm:mx-0"
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
                width={76}
                height={76}
                unoptimized
                className={`${isVertical ? "w-14 h-14 sm:w-18 sm:h-18" : "w-16 h-16 sm:w-20 sm:h-20"} object-contain rounded-md`}
              />
            ) : (
              <div className={`${isVertical ? "w-14 h-14 sm:w-18 sm:h-18" : "w-16 h-16 sm:w-20 sm:h-20"} flex items-center justify-center text-zinc-400`}>
                <QrCode className="w-6 h-6 animate-pulse" />
              </div>
            )}
            <span
              className={`text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider mt-0.5 ${
                isDark ? "text-zinc-400" : "text-zinc-800"
              }`}
            >
              Scan to Open
            </span>
          </div>
        )}
      </div>

      <div
        className={`pt-2 border-t flex items-center justify-between gap-1.5 flex-wrap text-[10px] font-mono shrink-0 ${
          isDark
            ? "border-white/10 text-zinc-400"
            : "border-zinc-300/80 text-zinc-600"
        }`}
      >
        <div className="flex items-center gap-1 flex-wrap">
          {!isVertical && !isSquare &&
            stats.slice(0, 3).map((s, idx) => (
              <span
                key={idx}
                className={`px-1.5 py-0.5 rounded-[4px] border ${
                  isDark
                    ? "bg-white/5 border-white/10 text-zinc-300"
                    : "bg-black/5 border-black/10 text-zinc-700"
                }`}
              >
                {s.label}: <strong className={isDark ? "text-white" : "text-zinc-900"}>{s.value}</strong>
              </span>
            ))}
        </div>

        <span className="text-[9px] sm:text-[10px] font-semibold text-blue-500 dark:text-blue-400 ml-auto">
          {displayDomain}
        </span>
      </div>
    </div>
  );
}
