import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import {
  ASPECT_RATIO_CONFIGS,
  getCurrentDomain,
} from "@/lib/share-utils";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const trimmed = (text || "").trim();
  if (!trimmed) return [];
  const words = trimmed.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
        if (lines.length === maxLines - 1) {
          let remaining = words.slice(i).join(" ");
          while (ctx.measureText(`${remaining}...`).width > maxWidth && remaining.length > 0) {
            remaining = remaining.slice(0, -1);
          }
          lines.push(`${remaining}...`);
          return lines;
        }
      } else {
        let singleWord = word;
        while (ctx.measureText(`${singleWord}...`).width > maxWidth && singleWord.length > 0) {
          singleWord = singleWord.slice(0, -1);
        }
        lines.push(`${singleWord}...`);
        if (lines.length >= maxLines) return lines;
        currentLine = "";
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

export async function generateShareCardBlob(
  item: ShareItemData,
  theme: ShareTheme = "dark",
  palette: SharePalette = "zinc",
  aspectRatio: ShareAspectRatio = "16:9",
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Canvas generation requires browser environment");
  }

  const ratioConfig = ASPECT_RATIO_CONFIGS[aspectRatio] || ASPECT_RATIO_CONFIGS["16:9"];
  const width = ratioConfig.width;
  const height = ratioConfig.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  const displayDomain = domain || getCurrentDomain();

  try {
    const bgImg = await loadImage("/images/share-card-bg.png");
    ctx.drawImage(bgImg, 0, 0, width, height);
  } catch {
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#080b14");
    bgGradient.addColorStop(1, "#020408");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
  }

  const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
  overlayGrad.addColorStop(0, "rgba(0, 0, 0, 0.55)");
  overlayGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.25)");
  overlayGrad.addColorStop(1, "rgba(0, 0, 0, 0.8)");
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, width, height);

  const padding = 36;
  const cardX = padding;
  const cardY = padding;
  const cardW = width - padding * 2;
  const cardH = height - padding * 2;

  ctx.fillStyle = "rgba(7, 10, 18, 0.85)";
  ctx.fillRect(cardX, cardY, cardW, cardH);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(cardX, cardY, cardW, cardH);

  const brandMarkX = cardX + 36;
  const brandMarkY = cardY + 36;
  const brandMarkSize = 46;

  try {
    const logoImg = await loadImage("/brand/logo-mark-white.png");
    ctx.drawImage(logoImg, brandMarkX, brandMarkY, brandMarkSize, brandMarkSize);
  } catch {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(brandMarkX, brandMarkY, brandMarkSize, brandMarkSize);
    ctx.fillStyle = "#09090b";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", brandMarkX + brandMarkSize / 2, brandMarkY + brandMarkSize / 2 + 1);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Skills", brandMarkX + brandMarkSize + 14, brandMarkY + 3);

  ctx.font = "600 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.fillText(displayDomain, brandMarkX + brandMarkSize + 14, brandMarkY + 28);

  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  if (showUserBadge) {
    const userText = `@${userAttribution?.username}`;
    ctx.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    const userBadgeWidth = ctx.measureText(userText).width + 36;
    const userBadgeX = cardX + cardW - userBadgeWidth - 36;
    const userBadgeY = brandMarkY + 6;

    ctx.fillStyle = "rgba(6, 78, 59, 0.4)";
    ctx.fillRect(userBadgeX, userBadgeY, userBadgeWidth, 34);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(userBadgeX, userBadgeY, userBadgeWidth, 34);

    ctx.beginPath();
    ctx.arc(userBadgeX + 17, userBadgeY + 17, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText(userText, userBadgeX + 30, userBadgeY + 17);
  }

  let currentY = brandMarkY + 84;
  const contentWidth = cardW - 72;

  if (item.author) {
    ctx.font = "600 16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`by @${item.author.replace(/^@/, "")}`, cardX + 36, currentY);
    currentY += 32;
  }

  ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const titleLines = wrapText(ctx, item.title, contentWidth, 2);
  for (const line of titleLines) {
    ctx.fillText(line, cardX + 36, currentY);
    currentY += 52;
  }

  ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#cbd5e1";
  const descLines = wrapText(ctx, item.description || "", contentWidth, 3);
  currentY += 10;
  for (const line of descLines) {
    ctx.fillText(line, cardX + 36, currentY);
    currentY += 32;
  }

  const footerY = cardY + cardH - 56;
  ctx.beginPath();
  ctx.moveTo(cardX + 36, footerY);
  ctx.lineTo(cardX + cardW - 36, footerY);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const stats = item.stats && item.stats.length > 0
    ? item.stats
    : [
        { label: "Community", value: "Verified" },
        { label: "License", value: "Open Source" },
      ];

  let statX = cardX + 36;
  ctx.font = "500 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  for (const stat of stats.slice(0, 3)) {
    const statText = `${stat.label}: ${stat.value}`;
    const statW = ctx.measureText(statText).width + 20;

    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(statX, footerY + 12, statW, 30);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(statX, footerY + 12, statW, 30);

    const isStar = stat.label.toLowerCase().includes("star") || stat.label.toLowerCase().includes("cop");
    const isFork = stat.label.toLowerCase().includes("fork") || stat.label.toLowerCase().includes("var");
    ctx.fillStyle = isStar ? "#fbbf24" : isFork ? "#38bdf8" : "#34d399";
    ctx.fillText(statText, statX + 10, footerY + 27);
    statX += statW + 10;
  }

  ctx.font = "bold 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = "#38bdf8";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(displayDomain, cardX + cardW - 36, footerY + 27);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    }, "image/png");
  });
}

export async function downloadShareCardImage(
  item: ShareItemData,
  theme: ShareTheme = "dark",
  palette: SharePalette = "zinc",
  aspectRatio: ShareAspectRatio = "16:9",
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<void> {
  const blob = await generateShareCardBlob(item, theme, palette, aspectRatio, userAttribution, domain);
  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  const safeSlug = (item.slug || item.title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  anchor.download = `skills-${safeSlug}-16x9.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
}

export async function copyShareCardImage(
  item: ShareItemData,
  theme: ShareTheme = "dark",
  palette: SharePalette = "zinc",
  aspectRatio: ShareAspectRatio = "16:9",
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      return false;
    }
    const blob = await generateShareCardBlob(item, theme, palette, aspectRatio, userAttribution, domain);
    const itemData = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([itemData]);
    return true;
  } catch {
    return false;
  }
}