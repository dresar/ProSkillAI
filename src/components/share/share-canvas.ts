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

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
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

  const domainText = domain || getCurrentDomain();

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
  overlayGrad.addColorStop(0, "rgba(0, 0, 0, 0.45)");
  overlayGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
  overlayGrad.addColorStop(1, "rgba(0, 0, 0, 0.65)");
  ctx.fillStyle = overlayGrad;
  ctx.fillRect(0, 0, width, height);

  const padding = width >= 1000 ? 44 : 32;
  const cardX = padding;
  const cardY = padding;
  const cardW = width - padding * 2;
  const cardH = height - padding * 2;
  const cardRadius = 24;

  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fillStyle = "rgba(7, 10, 18, 0.82)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const brandMarkX = cardX + 36;
  const brandMarkY = cardY + 36;
  const brandMarkSize = 46;

  try {
    const logoImg = await loadImage("/brand/logo-mark-white.png");
    ctx.drawImage(logoImg, brandMarkX, brandMarkY, brandMarkSize, brandMarkSize);
  } catch {
    drawRoundedRect(ctx, brandMarkX, brandMarkY, brandMarkSize, brandMarkSize, 10);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
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
  ctx.fillText(domainText, brandMarkX + brandMarkSize + 14, brandMarkY + 28);

  const showUserBadge = Boolean(userAttribution?.show && userAttribution?.username);
  const typeLabels: Record<string, string> = {
    skill: "AGENT SKILL",
    prompt: "PROMPT",
    repo: "TRENDING REPO",
    mcp: "MCP SERVER",
  };
  const typeLabel = typeLabels[item.type] || item.type.toUpperCase();

  ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  if (showUserBadge) {
    const userText = `@${userAttribution?.username}`;
    const userBadgeWidth = ctx.measureText(userText).width + 36;
    const userBadgeX = cardX + cardW - userBadgeWidth - 36;
    const userBadgeY = brandMarkY + 6;

    drawRoundedRect(ctx, userBadgeX, userBadgeY, userBadgeWidth, 34, 17);
    ctx.fillStyle = "rgba(6, 78, 59, 0.4)";
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(userBadgeX + 17, userBadgeY + 17, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#38bdf8";
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#7dd3fc";
    ctx.fillText(userText, userBadgeX + 30, userBadgeY + 17);
  } else {
    const badgeText = typeLabel;
    const badgeWidth = ctx.measureText(badgeText).width + 24;
    const badgeX = cardX + cardW - badgeWidth - 36;
    const badgeY = brandMarkY + 6;

    drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, 32, 8);
    ctx.fillStyle = "rgba(6, 78, 59, 0.35)";
    ctx.fill();
    ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#7dd3fc";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 16);
  }

  const categoryName = item.category || (
    item.type === "skill"
      ? "Agent Skill"
      : item.type === "prompt"
      ? "Prompt Engineering"
      : item.type === "repo"
      ? "Open Source"
      : "Developer Tools"
  );

  const isVertical = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";
  const coverUrl = item.cover || (item.type === "repo" ? `https://opengraph.githubassets.com/1/${item.title}` : null);

  let coverImg: HTMLImageElement | null = null;
  if (coverUrl) {
    try {
      coverImg = await loadImage(coverUrl);
    } catch {
      coverImg = null;
    }
  }

  if (isVertical) {
    let currentY = brandMarkY + 100;

    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 26;
    const catX = (width - catWidth) / 2;
    drawRoundedRect(ctx, catX, currentY, catWidth, 34, 8);
    ctx.fillStyle = "rgba(30, 58, 138, 0.6)";
    ctx.fill();
    ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, width / 2, currentY + 17);

    currentY += 56;

    if (item.author) {
      ctx.font = "600 16px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`by @${item.author.replace(/^@/, "")}`, width / 2, currentY);
      currentY += 34;
    }

    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, cardW - 80, 3);
    for (const line of titleLines) {
      ctx.fillText(line, width / 2, currentY);
      currentY += 56;
    }

    if (coverImg) {
      const coverW = Math.min(cardW - 80, 540);
      const coverH = coverW * 0.5;
      const coverX = (width - coverW) / 2;
      currentY += 16;
      ctx.save();
      drawRoundedRect(ctx, coverX, currentY, coverW, coverH, 14);
      ctx.clip();
      ctx.drawImage(coverImg, coverX, currentY, coverW, coverH);
      ctx.restore();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, coverX, currentY, coverW, coverH, 14);
      ctx.stroke();
      currentY += coverH + 20;
    }

    ctx.font = "500 22px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const descLines = wrapText(ctx, item.description || "", cardW - 100, 4);
    currentY += 12;
    for (const line of descLines) {
      ctx.fillText(line, width / 2, currentY);
      currentY += 34;
    }

    const footerY = cardY + cardH - 60;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 16px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, width / 2, footerY + 30);
  } else if (isSquare) {
    let currentY = brandMarkY + 80;

    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 24;
    const catX = cardX + 36;
    drawRoundedRect(ctx, catX, currentY, catWidth, 32, 6);
    ctx.fillStyle = "rgba(30, 58, 138, 0.6)";
    ctx.fill();
    ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, catX + catWidth / 2, currentY + 16);

    if (item.author) {
      ctx.font = "600 15px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "left";
      ctx.fillText(`by @${item.author.replace(/^@/, "")}`, catX + catWidth + 14, currentY + 16);
    }

    currentY += 46;

    ctx.font = "bold 40px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, cardW - 72, 2);
    for (const line of titleLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 50;
    }

    if (coverImg) {
      const coverW = cardW - 72;
      const coverH = Math.min(260, coverW * 0.45);
      const coverX = cardX + 36;
      currentY += 10;
      ctx.save();
      drawRoundedRect(ctx, coverX, currentY, coverW, coverH, 12);
      ctx.clip();
      ctx.drawImage(coverImg, coverX, currentY, coverW, coverH);
      ctx.restore();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, coverX, currentY, coverW, coverH, 12);
      ctx.stroke();
      currentY += coverH + 16;
    }

    ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const descLines = wrapText(ctx, item.description || "", cardW - 72, 3);
    currentY += 8;
    for (const line of descLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 30;
    }

    const footerY = cardY + cardH - 52;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const stats = item.stats && item.stats.length > 0
      ? item.stats
      : [
          { label: "Community", value: "Verified" },
          { label: "License", value: "Open Source" },
        ];

    let statX = cardX + 36;
    ctx.font = "500 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (const stat of stats.slice(0, 3)) {
      const statText = `${stat.label}: ${stat.value}`;
      const statW = ctx.measureText(statText).width + 18;

      drawRoundedRect(ctx, statX, footerY + 12, statW, 28, 6);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const isStar = stat.label.toLowerCase().includes("star") || stat.label.toLowerCase().includes("cop");
      const isFork = stat.label.toLowerCase().includes("fork") || stat.label.toLowerCase().includes("var");
      ctx.fillStyle = isStar ? "#fbbf24" : isFork ? "#38bdf8" : "#34d399";
      ctx.fillText(statText, statX + 9, footerY + 26);
      statX += statW + 8;
    }

    ctx.font = "bold 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, cardX + cardW - 36, footerY + 26);
  } else {
    let currentY = brandMarkY + 76;
    const mainColWidth = coverImg ? cardW - 380 : cardW - 72;

    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 22;
    const catX = cardX + 36;
    drawRoundedRect(ctx, catX, currentY, catWidth, 30, 6);
    ctx.fillStyle = "rgba(30, 58, 138, 0.6)";
    ctx.fill();
    ctx.strokeStyle = "rgba(96, 165, 250, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#93c5fd";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, catX + catWidth / 2, currentY + 15);

    if (item.author) {
      const authorText = `by @${item.author.replace(/^@/, "")}`;
      ctx.font = "600 14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "left";
      ctx.fillText(authorText, catX + catWidth + 14, currentY + 15);
    }

    currentY += 44;

    ctx.font = "bold 40px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, mainColWidth, 2);
    for (const line of titleLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 48;
    }

    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#cbd5e1";
    const descLines = wrapText(ctx, item.description || "", mainColWidth, 3);
    currentY += 8;
    for (const line of descLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 26;
    }

    if (coverImg) {
      const coverW = 320;
      const coverH = 180;
      const coverX = cardX + cardW - coverW - 36;
      const coverY = brandMarkY + 76;
      ctx.save();
      drawRoundedRect(ctx, coverX, coverY, coverW, coverH, 12);
      ctx.clip();
      ctx.drawImage(coverImg, coverX, coverY, coverW, coverH);
      ctx.restore();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, coverX, coverY, coverW, coverH, 12);
      ctx.stroke();
    }

    const footerY = cardY + cardH - 52;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const stats = item.stats && item.stats.length > 0
      ? item.stats
      : [
          { label: "Community", value: "Verified" },
          { label: "License", value: "Open Source" },
        ];

    let statX = cardX + 36;
    ctx.font = "500 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    for (const stat of stats.slice(0, 3)) {
      const statText = `${stat.label}: ${stat.value}`;
      const statW = ctx.measureText(statText).width + 18;

      drawRoundedRect(ctx, statX, footerY + 12, statW, 26, 5);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const isStar = stat.label.toLowerCase().includes("star") || stat.label.toLowerCase().includes("cop");
      const isFork = stat.label.toLowerCase().includes("fork") || stat.label.toLowerCase().includes("var");
      ctx.fillStyle = isStar ? "#fbbf24" : isFork ? "#38bdf8" : "#34d399";
      ctx.fillText(statText, statX + 9, footerY + 25);
      statX += statW + 8;
    }

    ctx.font = "bold 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, cardX + cardW - 36, footerY + 25);
  }

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
  const ratioLabel = aspectRatio.replace(":", "x");
  anchor.download = `skills-${safeSlug}-${ratioLabel}-${theme}.png`;
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