import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import {
  ASPECT_RATIO_CONFIGS,
  PALETTE_CONFIGS,
  buildShareUrl,
  generateQrCodeDataUrl,
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
  theme: ShareTheme,
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

  const isDark = theme === "dark";
  const p = PALETTE_CONFIGS[palette] || PALETTE_CONFIGS.zinc;
  const canonicalUrl = buildShareUrl(item.url);
  const domainText = domain || getCurrentDomain();

  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, isDark ? p.canvasDarkBgStart : p.canvasLightBgStart);
  bgGradient.addColorStop(1, isDark ? p.canvasDarkBgEnd : p.canvasLightBgEnd);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const padding = width >= 1000 ? 44 : 32;
  const cardX = padding;
  const cardY = padding;
  const cardW = width - padding * 2;
  const cardH = height - padding * 2;
  const cardRadius = 24;

  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fillStyle = isDark ? "rgba(10, 14, 23, 0.75)" : "rgba(255, 255, 255, 0.82)";
  ctx.fill();
  ctx.strokeStyle = isDark ? p.canvasDarkBorder : p.canvasLightBorder;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const brandMarkX = cardX + 36;
  const brandMarkY = cardY + 36;
  const brandMarkSize = 46;

  const logoSrc = isDark ? "/brand/logo-mark-white.png" : "/brand/logo-mark-black.png";
  try {
    const logoImg = await loadImage(logoSrc);
    ctx.drawImage(logoImg, brandMarkX, brandMarkY, brandMarkSize, brandMarkSize);
  } catch {
    drawRoundedRect(ctx, brandMarkX, brandMarkY, brandMarkSize, brandMarkSize, 10);
    ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
    ctx.fill();
    ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
    ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("P", brandMarkX + brandMarkSize / 2, brandMarkY + brandMarkSize / 2 + 1);
  }

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
  ctx.fillText("ProSkillAI", brandMarkX + brandMarkSize + 14, brandMarkY + 4);

  ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
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
    ctx.fillStyle = isDark ? "rgba(30, 58, 138, 0.45)" : "rgba(219, 234, 254, 0.9)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(96, 165, 250, 0.4)" : "rgba(59, 130, 246, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(userBadgeX + 17, userBadgeY + 17, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = isDark ? "#93c5fd" : "#1e40af";
    ctx.fillText(userText, userBadgeX + 30, userBadgeY + 17);
  } else {
    const badgeText = typeLabel;
    const badgeWidth = ctx.measureText(badgeText).width + 24;
    const badgeX = cardX + cardW - badgeWidth - 36;
    const badgeY = brandMarkY + 6;

    drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, 32, 8);
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#e4e4e7" : "#27272a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 16);
  }

  const isVertical = aspectRatio === "9:16" || aspectRatio === "3:4";
  const isSquare = aspectRatio === "1:1";

  const qrDataUrl = await generateQrCodeDataUrl(canonicalUrl, theme);
  const qrImage = await loadImage(qrDataUrl);

  const categoryName = item.category || (
    item.type === "skill"
      ? "Agent Skill"
      : item.type === "prompt"
      ? "Prompt Engineering"
      : item.type === "repo"
      ? "Open Source"
      : "Developer Tools"
  );

  if (isVertical) {
    const contentY = brandMarkY + 110;

    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 26;
    const catX = (width - catWidth) / 2;
    drawRoundedRect(ctx, catX, contentY, catWidth, 34, 8);
    ctx.fillStyle = isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 246, 255, 1)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(191, 219, 254, 1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, width / 2, contentY + 17);

    ctx.font = "bold 44px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, cardW - 100, 3);
    let currentY = contentY + 54;
    for (const line of titleLines) {
      ctx.fillText(line, width / 2, currentY);
      currentY += 56;
    }

    ctx.font = "500 21px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";
    const descLines = wrapText(ctx, item.description || "", cardW - 120, 3);
    currentY += 12;
    for (const line of descLines) {
      ctx.fillText(line, width / 2, currentY);
      currentY += 32;
    }

    const qrCardSize = height >= 1600 ? 320 : 250;
    const qrCardX = (width - qrCardSize) / 2;
    const qrCardY = currentY + 50;

    drawRoundedRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize + 48, 20);
    ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const qrInnerSize = qrCardSize - 40;
    ctx.drawImage(qrImage, qrCardX + 20, qrCardY + 20, qrInnerSize, qrInnerSize);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";
    ctx.fillText("SCAN TO OPEN", width / 2, qrCardY + qrCardSize + 22);

    const footerY = cardY + cardH - 50;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, width / 2, footerY + 26);
  } else if (isSquare) {
    const contentY = brandMarkY + 90;

    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 24;
    const catX = cardX + 36;
    drawRoundedRect(ctx, catX, contentY, catWidth, 32, 6);
    ctx.fillStyle = isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 246, 255, 1)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(191, 219, 254, 1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, catX + catWidth / 2, contentY + 16);

    ctx.font = "bold 42px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, cardW - 72, 3);
    let currentY = contentY + 48;
    for (const line of titleLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 52;
    }

    ctx.font = "500 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";
    const descLines = wrapText(ctx, item.description || "", cardW - 72, 3);
    currentY += 12;
    for (const line of descLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 30;
    }

    const qrCardSize = 220;
    const qrCardX = (width - qrCardSize) / 2;
    const qrCardY = currentY + 36;

    drawRoundedRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize + 40, 16);
    ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const qrInnerSize = qrCardSize - 36;
    ctx.drawImage(qrImage, qrCardX + 18, qrCardY + 18, qrInnerSize, qrInnerSize);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";
    ctx.fillText("SCAN TO OPEN", width / 2, qrCardY + qrCardSize + 18);

    const footerY = cardY + cardH - 50;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 15px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, cardX + cardW - 36, footerY + 25);
  } else {
    const contentY = brandMarkY + 76;
    const mainColWidth = cardW - 270;

    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    const catWidth = ctx.measureText(categoryName).width + 22;
    const catX = cardX + 36;
    drawRoundedRect(ctx, catX, contentY, catWidth, 30, 6);
    ctx.fillStyle = isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 246, 255, 1)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(191, 219, 254, 1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(categoryName, catX + catWidth / 2, contentY + 15);

    if (item.author) {
      const authorText = `by @${item.author.replace(/^@/, "")}`;
      ctx.font = "500 13px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = isDark ? "#a1a1aa" : "#71717a";
      ctx.textAlign = "left";
      ctx.fillText(authorText, catX + catWidth + 14, contentY + 15);
    }

    ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    const titleLines = wrapText(ctx, item.title, mainColWidth, 2);
    let currentY = contentY + 44;
    for (const line of titleLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 46;
    }

    ctx.font = "500 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#d4d4d8" : "#52525b";
    const descLines = wrapText(ctx, item.description || "", mainColWidth, 2);
    currentY += 8;
    for (const line of descLines) {
      ctx.fillText(line, cardX + 36, currentY);
      currentY += 26;
    }

    const qrCardSize = 190;
    const qrCardX = cardX + cardW - qrCardSize - 36;
    const qrCardY = contentY + 10;

    drawRoundedRect(ctx, qrCardX, qrCardY, qrCardSize, qrCardSize + 36, 16);
    ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const qrInnerSize = qrCardSize - 32;
    ctx.drawImage(qrImage, qrCardX + 16, qrCardY + 16, qrInnerSize, qrInnerSize);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";
    ctx.fillText("SCAN TO OPEN", qrCardX + qrCardSize / 2, qrCardY + qrCardSize + 16);

    const footerY = cardY + cardH - 52;
    ctx.beginPath();
    ctx.moveTo(cardX + 36, footerY);
    ctx.lineTo(cardX + cardW - 36, footerY);
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
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

      drawRoundedRect(ctx, statX, footerY + 10, statW, 26, 5);
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
      ctx.fill();
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isDark ? "#e4e4e7" : "#27272a";
      ctx.fillText(statText, statX + 9, footerY + 23);
      statX += statW + 8;
    }

    ctx.font = "bold 14px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    ctx.fillStyle = isDark ? "#60a5fa" : "#2563eb";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(domainText, cardX + cardW - 36, footerY + 23);
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
  theme: ShareTheme,
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
  anchor.download = `proskillai-${safeSlug}-${ratioLabel}-${theme}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
}

export async function copyShareCardImage(
  item: ShareItemData,
  theme: ShareTheme,
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
