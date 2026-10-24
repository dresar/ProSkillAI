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
import {
  extractOwnerAndRepo,
  formatCompactNumber,
  getCurrentDomain,
} from "@/lib/share-utils";

interface ShareCardProps {
  item: ShareItemData;
  theme?: ShareTheme;
  palette?: SharePalette;
  aspectRatio?: ShareAspectRatio;
  userAttribution?: ShareUserAttribution;
  domain?: string;
  className?: string;
}

function getTitleFontSize(title: string): number {
  const len = title.length;
  if (len <= 18) return 62;
  if (len <= 32) return 52;
  return 44;
}

function truncateDescription(desc: string, maxLen = 105): string {
  const clean = (desc || "").trim().replace(/\s+/g, " ");
  if (!clean) return "";
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1).trim() + "…";
}

export function ShareCard({
  item,
  userAttribution,
  domain,
  className = "",
}: ShareCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState<number>(0.38);

  const displayDomain = domain || getCurrentDomain();
  const { owner, repo, title } = extractOwnerAndRepo(item);

  const username =
    userAttribution?.show && userAttribution?.username?.trim()
      ? (userAttribution.username.startsWith("@")
          ? userAttribution.username.trim()
          : `@${userAttribution.username.trim()}`)
      : null;

  let rawStars = "555.7k";
  let rawForks = "52k";
  let rawRank = "#1";

  if (item.stats && item.stats.length > 0) {
    const starStat = item.stats.find((s) => /star|cop/i.test(s.label));
    if (starStat) rawStars = String(starStat.value);

    const forkStat = item.stats.find((s) => /fork|var|file/i.test(s.label));
    if (forkStat) rawForks = String(forkStat.value);

    const rankStat = item.stats.find((s) => /rank/i.test(s.label));
    if (rankStat) rawRank = String(rankStat.value);
  }

  const formattedStars = formatCompactNumber(rawStars);
  const formattedForks = formatCompactNumber(rawForks);
  const formattedRank = rawRank.startsWith("#") ? rawRank : `#${rawRank}`;

  const titleSize = getTitleFontSize(title);
  const description = truncateDescription(
    item.description ||
      "Supercharge your development workflow with curated AI agent skills, prompts, and MCP tools.",
    110
  );

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const currentWidth = el.offsetWidth;
      if (currentWidth > 0) {
        setScale(currentWidth / 1200);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-16/9 overflow-hidden select-none bg-[#FFD23F] ${className}`}
    >
      <div
        style={{
          width: 1200,
          height: 675,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 bg-[#FFD23F] font-['Space_Mono',monospace]"
      >
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 56,
            bottom: 56,
            backgroundColor: "#FFFFFF",
            border: "6px solid #000000",
            boxShadow: "16px 16px 0 #000000",
          }}
          className="flex flex-col justify-between p-[32px_40px]"
        >
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="w-[72px] h-[72px] rounded-full border-4 border-black bg-[#FFD23F] flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/brand/logo-mark-black.png"
                  alt="ProSkillAI Logo"
                  width={52}
                  height={52}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-['Archivo_Black',sans-serif] text-[30px] text-black leading-[1.1] tracking-[-0.5px]">
                  ProSkillAI
                </span>
                <span className="font-['Space_Mono',monospace] text-[18px] text-black leading-[1.2]">
                  {displayDomain}
                </span>
              </div>
            </div>

            {username ? (
              <div className="flex items-center gap-3 bg-[#FF5CA8] border-4 border-black shadow-[5px_5px_0_#000] px-[18px] py-[8px]">
                <div className="w-5 h-5 rounded-full bg-black shrink-0" />
                <span className="font-['Space_Mono',monospace] font-bold text-[20px] text-black">
                  {username}
                </span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col mt-7 grow">
            <div className="self-start bg-black text-white font-['Space_Mono',monospace] font-bold text-[20px] px-3 py-1.5">
              by @{owner}
            </div>

            <div
              className="font-['Archivo_Black',sans-serif] uppercase text-black mt-3.5 mb-2.5 line-clamp-2 leading-[1.05]"
              style={{ fontSize: `${titleSize}px` }}
            >
              {title}
            </div>

            {description && (
              <div className="font-['Space_Mono',monospace] font-bold text-[24px] leading-[1.35] text-black line-clamp-2">
                {description}
              </div>
            )}
          </div>

          <div className="border-t-4 border-black pt-5 mt-auto flex flex-row items-center justify-between w-full">
            <div className="flex gap-3.5">
              <div className="bg-[#FFD23F] border-4 border-black shadow-[5px_5px_0_#000] px-[18px] py-[10px] font-['Space_Mono',monospace] font-bold text-[20px] text-black">
                Stars: {formattedStars}
              </div>
              <div className="bg-[#5CE1E6] border-4 border-black shadow-[5px_5px_0_#000] px-[18px] py-[10px] font-['Space_Mono',monospace] font-bold text-[20px] text-black">
                Forks: {formattedForks}
              </div>
              <div className="bg-[#B6FF5C] border-4 border-black shadow-[5px_5px_0_#000] px-[18px] py-[10px] font-['Space_Mono',monospace] font-bold text-[20px] text-black">
                Rank: {formattedRank}
              </div>
            </div>

            <span className="font-['Space_Mono',monospace] font-bold text-[20px] text-black text-right">
              {displayDomain}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
