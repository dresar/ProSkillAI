import QRCode from "qrcode";
import type { ShareItemData, SharePalette, ShareTheme } from "@/types/share";

export const SITE_URL = "https://proskillai.dev";

export interface PaletteConfig {
  id: SharePalette;
  nameEn: string;
  nameId: string;
  dotColor: string;
  darkGradient: string;
  lightGradient: string;
  darkBorder: string;
  lightBorder: string;
  darkBadge: string;
  lightBadge: string;
  canvasDarkBgStart: string;
  canvasDarkBgEnd: string;
  canvasDarkAccent: string;
  canvasDarkBorder: string;
  canvasLightBgStart: string;
  canvasLightBgEnd: string;
  canvasLightAccent: string;
  canvasLightBorder: string;
}

export const PALETTE_CONFIGS: Record<SharePalette, PaletteConfig> = {
  zinc: {
    id: "zinc",
    nameEn: "Obsidian Zinc",
    nameId: "Seng Obsidian",
    dotColor: "#71717a",
    darkGradient: "from-zinc-900 via-neutral-900 to-black",
    lightGradient: "from-zinc-100 via-neutral-50 to-white",
    darkBorder: "border-zinc-700/80",
    lightBorder: "border-zinc-300",
    darkBadge: "bg-zinc-800 text-zinc-100 border-zinc-700",
    lightBadge: "bg-zinc-200 text-zinc-900 border-zinc-300",
    canvasDarkBgStart: "#18181b",
    canvasDarkBgEnd: "#09090b",
    canvasDarkAccent: "#e4e4e7",
    canvasDarkBorder: "#3f3f46",
    canvasLightBgStart: "#f4f4f5",
    canvasLightBgEnd: "#ffffff",
    canvasLightAccent: "#18181b",
    canvasLightBorder: "#e4e4e7",
  },
  emerald: {
    id: "emerald",
    nameEn: "Cyber Emerald",
    nameId: "Zamrud Siber",
    dotColor: "#10b981",
    darkGradient: "from-emerald-950 via-zinc-950 to-black",
    lightGradient: "from-emerald-50 via-teal-50/50 to-white",
    darkBorder: "border-emerald-600/40",
    lightBorder: "border-emerald-300",
    darkBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    lightBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
    canvasDarkBgStart: "#022c22",
    canvasDarkBgEnd: "#09090b",
    canvasDarkAccent: "#34d399",
    canvasDarkBorder: "#065f46",
    canvasLightBgStart: "#ecfdf5",
    canvasLightBgEnd: "#ffffff",
    canvasLightAccent: "#059669",
    canvasLightBorder: "#a7f3d0",
  },
  violet: {
    id: "violet",
    nameEn: "Electric Violet",
    nameId: "Violet Elektrik",
    dotColor: "#8b5cf6",
    darkGradient: "from-violet-950 via-zinc-950 to-black",
    lightGradient: "from-violet-50 via-purple-50/50 to-white",
    darkBorder: "border-violet-600/40",
    lightBorder: "border-violet-300",
    darkBadge: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    lightBadge: "bg-violet-100 text-violet-800 border-violet-300",
    canvasDarkBgStart: "#2e1065",
    canvasDarkBgEnd: "#09090b",
    canvasDarkAccent: "#a78bfa",
    canvasDarkBorder: "#5b21b6",
    canvasLightBgStart: "#f5f3ff",
    canvasLightBgEnd: "#ffffff",
    canvasLightAccent: "#7c3aed",
    canvasLightBorder: "#ddd6fe",
  },
  cyan: {
    id: "cyan",
    nameEn: "Neon Cyan",
    nameId: "Sian Neon",
    dotColor: "#06b6d4",
    darkGradient: "from-cyan-950 via-zinc-950 to-black",
    lightGradient: "from-cyan-50 via-sky-50/50 to-white",
    darkBorder: "border-cyan-600/40",
    lightBorder: "border-cyan-300",
    darkBadge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    lightBadge: "bg-cyan-100 text-cyan-800 border-cyan-300",
    canvasDarkBgStart: "#083344",
    canvasDarkBgEnd: "#09090b",
    canvasDarkAccent: "#22d3ee",
    canvasDarkBorder: "#155e75",
    canvasLightBgStart: "#ecfeff",
    canvasLightBgEnd: "#ffffff",
    canvasLightAccent: "#0891b2",
    canvasLightBorder: "#a5f3fc",
  },
  amber: {
    id: "amber",
    nameEn: "Solar Amber",
    nameId: "Amber Surya",
    dotColor: "#f59e0b",
    darkGradient: "from-amber-950 via-zinc-950 to-black",
    lightGradient: "from-amber-50 via-yellow-50/50 to-white",
    darkBorder: "border-amber-600/40",
    lightBorder: "border-amber-300",
    darkBadge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    lightBadge: "bg-amber-100 text-amber-800 border-amber-300",
    canvasDarkBgStart: "#451a03",
    canvasDarkBgEnd: "#09090b",
    canvasDarkAccent: "#fbbf24",
    canvasDarkBorder: "#78350f",
    canvasLightBgStart: "#fffbeb",
    canvasLightBgEnd: "#ffffff",
    canvasLightAccent: "#d97706",
    canvasLightBorder: "#fde68a",
  },
  sunset: {
    id: "sunset",
    nameEn: "Sunset Crimson",
    nameId: "Merah Senja",
    dotColor: "#f43f5e",
    darkGradient: "from-rose-950 via-neutral-950 to-orange-950",
    lightGradient: "from-rose-50 via-orange-50/50 to-white",
    darkBorder: "border-rose-600/40",
    lightBorder: "border-rose-300",
    darkBadge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    lightBadge: "bg-rose-100 text-rose-800 border-rose-300",
    canvasDarkBgStart: "#4c0519",
    canvasDarkBgEnd: "#1c1917",
    canvasDarkAccent: "#fb7185",
    canvasDarkBorder: "#881337",
    canvasLightBgStart: "#fff1f2",
    canvasLightBgEnd: "#fff7ed",
    canvasLightAccent: "#e11d48",
    canvasLightBorder: "#fecdd3",
  },
};

export function buildShareUrl(rawUrl: string, origin?: string): string {
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  const base = origin || (typeof window !== "undefined" && window.location.origin ? window.location.origin : SITE_URL);
  const normalizedPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${base}${normalizedPath}`;
}

export function buildSocialShareUrls(item: ShareItemData, canonicalUrl: string) {
  const shortDesc = item.description.length > 120
    ? `${item.description.slice(0, 117)}...`
    : item.description;
  const shareText = `${item.title} — ${shortDesc} via @ProSkillAI`;

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonicalUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${canonicalUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(shareText)}`,
  };
}

export async function generateQrCodeDataUrl(url: string, theme: ShareTheme): Promise<string> {
  const isDark = theme === "dark";
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 256,
    color: {
      dark: isDark ? "#ffffff" : "#09090b",
      light: isDark ? "#09090b" : "#ffffff",
    },
  });
}

export async function generateQrCodeSvg(url: string, theme: ShareTheme): Promise<string> {
  const isDark = theme === "dark";
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    color: {
      dark: isDark ? "#ffffff" : "#09090b",
      light: isDark ? "#09090b" : "#ffffff",
    },
  });
}
