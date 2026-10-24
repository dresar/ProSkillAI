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
  userAttribution,
  domain,
  className = "",
}: ShareCardProps) {
  const displayDomain = domain || getCurrentDomain();

  const stats = item.stats && item.stats.length > 0
    ? item.stats
    : [
        { label: "Community", value: "Verified" },
        { label: "License", value: "Open Source" },
      ];

  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  const displayUsername = userAttribution?.username || "";

  return (
    <div
      className={`relative w-full aspect-16/9 rounded-xs border border-cyan-500/30 bg-[#070a12] text-white overflow-hidden select-none flex flex-col justify-between shadow-2xl p-4 sm:p-5.5 ${className}`}
      style={{
        backgroundImage: "url('/images/share-card-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80 pointer-events-none" />

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

        {showUserBadge && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-xs border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 text-[10px] font-medium shrink-0">
            <span className="w-3 h-3 rounded-xs bg-cyan-400 text-black text-[8px] font-bold flex items-center justify-center uppercase">
              {displayUsername.charAt(0) || "U"}
            </span>
            <span className="font-semibold tracking-tight font-mono">
              @{displayUsername}
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10 my-auto py-1 flex flex-col gap-1.5 text-left">
        {item.author && (
          <div className="text-[10px] sm:text-[11px] font-mono text-cyan-300">
            by @{item.author.replace(/^@/, "")}
          </div>
        )}

        <h3 className="font-extrabold tracking-tight leading-tight text-white text-sm sm:text-lg line-clamp-2">
          {item.title}
        </h3>

        {item.description && (
          <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed line-clamp-2 max-w-xl">
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
                className="px-1.5 py-0.5 rounded-xs border border-white/15 bg-black/50 text-[9px] sm:text-[10px] font-mono text-zinc-300"
              >
                {s.label}: <strong className={`font-bold ${valueColor}`}>{s.value}</strong>
              </span>
            );
          })}
        </div>

        <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 font-semibold shrink-0">
          verified
        </span>
      </div>
    </div>
  );
}