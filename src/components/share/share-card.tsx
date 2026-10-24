"use client";

import * as React from "react";
import Image from "next/image";
import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import { getCurrentDomain } from "@/lib/share-utils";

interface ShareCardProps {
  item: ShareItemData;
  theme?: ShareTheme;
  palette?: SharePalette;
  aspectRatio?: ShareAspectRatio;
  userAttribution?: ShareUserAttribution;
  domain?: string;
  className?: string;
}

export function ShareCard({
  item,
  aspectRatio = "16:9",
  userAttribution,
  domain,
  className = "",
}: ShareCardProps) {
  const displayDomain = domain || getCurrentDomain();

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

  const isStory = aspectRatio === "9:16";
  const isPortrait = aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const isVertical = isStory || isPortrait;

  const coverUrl = item.cover || (item.type === "repo" ? `https://opengraph.githubassets.com/1/${item.title}` : null);
  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  const displayUsername = userAttribution?.username || "";

  return (
    <div
      className={`relative w-full rounded-2xl border border-white/15 bg-black/95 text-white overflow-hidden select-none flex flex-col justify-between shadow-2xl transition-all duration-300 ${
        isStory ? "p-3 sm:p-4" : isSquare ? "p-3.5 sm:p-5" : "p-4 sm:p-5.5"
      } ${className}`}
      style={{
        backgroundImage: "url('/images/share-card-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 relative shrink-0">
            <Image
              src="/brand/logo-mark-white.png"
              alt="Skills Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain drop-shadow"
              priority
            />
          </div>
          <div className="leading-tight">
            <span className="text-xs sm:text-sm font-bold tracking-tight block bg-gradient-to-r from-white via-zinc-100 to-cyan-300 bg-clip-text text-transparent">
              Skills
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 block tracking-wide">
              {displayDomain}
            </span>
          </div>
        </div>

        {showUserBadge ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 text-[10px] font-medium shrink-0">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 text-black text-[8px] font-bold flex items-center justify-center uppercase">
              {displayUsername.charAt(0) || "U"}
            </span>
            <span className="font-semibold tracking-tight font-mono">
              @{displayUsername}
            </span>
          </div>
        ) : (
          <span className="text-[9px] sm:text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-[5px] border border-cyan-500/30 bg-cyan-950/60 text-cyan-300 shrink-0">
            {typeLabel}
          </span>
        )}
      </div>

      <div
        className={`relative z-10 my-auto py-1.5 ${
          isVertical
            ? "flex flex-col items-center text-center gap-2"
            : isSquare
            ? "flex flex-col gap-2"
            : "flex flex-col gap-2"
        }`}
      >
        <div className="flex items-center gap-1.5 flex-wrap justify-start">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight px-1.5 py-0.5 rounded-[4px] border border-blue-500/40 bg-blue-950/70 text-blue-300 font-mono">
            {categoryName}
          </span>
          {item.author && (
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-300">
              by <span className="text-cyan-300 font-mono">@{item.author.replace(/^@/, "")}</span>
            </span>
          )}
        </div>

        <h3
          className={`font-extrabold tracking-tight leading-tight text-white ${
            isStory
              ? "text-xs sm:text-sm line-clamp-2"
              : isPortrait
              ? "text-sm sm:text-base line-clamp-2"
              : isSquare
              ? "text-xs sm:text-sm line-clamp-2"
              : "text-sm sm:text-lg line-clamp-2"
          }`}
        >
          {item.title}
        </h3>

        {coverUrl && (
          <div
            className={`relative aspect-[2/1] w-full rounded-lg overflow-hidden border border-white/20 bg-black/50 shadow-md shrink-0 ${
              isStory ? "max-h-20" : isPortrait ? "max-h-24" : isSquare ? "max-h-24" : "max-h-28 sm:max-h-32"
            }`}
          >
            <Image
              src={coverUrl}
              alt={item.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {item.description && (
          <p
            className={`text-[10px] sm:text-xs text-zinc-300 leading-relaxed ${
              isStory
                ? "line-clamp-2"
                : isPortrait
                ? "line-clamp-2"
                : isSquare
                ? "line-clamp-2"
                : "line-clamp-2"
            }`}
          >
            {item.description}
          </p>
        )}
      </div>

      <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {stats.slice(0, 3).map((s, idx) => {
            const isStar = s.label.toLowerCase().includes("star") || s.label.toLowerCase().includes("cop");
            const isFork = s.label.toLowerCase().includes("fork") || s.label.toLowerCase().includes("var");
            const valueColor = isStar ? "text-amber-400" : isFork ? "text-cyan-400" : "text-emerald-400";
            return (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded-[4px] border border-white/10 bg-black/40 text-[9px] sm:text-[10px] font-mono text-zinc-300"
              >
                {s.label}: <strong className={`font-bold ${valueColor}`}>{s.value}</strong>
              </span>
            );
          })}
        </div>

        <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400/80 shrink-0">
          verified
        </span>
      </div>
    </div>
  );
}
