import type { ShareItemData, SharePalette, ShareTheme } from "@/types/share";
import { PALETTE_CONFIGS, buildShareUrl, generateQrCodeDataUrl } from "@/lib/share-utils";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
      if (lines.length === maxLines - 1) {
        let remaining = words.slice(i).join(" ");
        while (ctx.measureText(`${remaining}...`).width > maxWidth && remaining.length > 0) {
          remaining = remaining.slice(0, -1);
        }
        lines.push(`${remaining}...`);
        return lines;
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
  palette: SharePalette
): Promise<Blob> {
  if (typeof document === "undefined") {
    throw new Error("Canvas generation requires browser environment");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2d context");
  }

  const isDark = theme === "dark";
  const p = PALETTE_CONFIGS[palette] || PALETTE_CONFIGS.zinc;
  const canonicalUrl = buildShareUrl(item.url);

  const bgGradient = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGradient.addColorStop(0, isDark ? p.canvasDarkBgStart : p.canvasLightBgStart);
  bgGradient.addColorStop(1, isDark ? p.canvasDarkBgEnd : p.canvasLightBgEnd);
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x <= 1200; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 630);
    ctx.stroke();
  }
  for (let y = 0; y <= 630; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1200, y);
    ctx.stroke();
  }

  const cardX = 32;
  const cardY = 32;
  const cardW = 1136;
  const cardH = 566;
  const cardRadius = 24;

  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fillStyle = isDark ? "rgba(10, 10, 12, 0.65)" : "rgba(255, 255, 255, 0.75)";
  ctx.fill();
  ctx.strokeStyle = isDark ? p.canvasDarkBorder : p.canvasLightBorder;
  ctx.lineWidth = 2;
  ctx.stroke();

  const brandMarkX = cardX + 36;
  const brandMarkY = cardY + 36;

  drawRoundedRect(ctx, brandMarkX, brandMarkY, 44, 44, 10);
  ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
  ctx.fill();

  ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("P", brandMarkX + 22, brandMarkY + 23);

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = isDark ? "#ffffff" : "#09090b";
  ctx.fillText("ProSkillAI", brandMarkX + 56, brandMarkY + 4);

  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = isDark ? "#a1a1aa" : "#71717a";
  ctx.fillText("PROSKILLAI.DEV", brandMarkX + 56, brandMarkY + 28);

  const typeLabels: Record<string, string> = {
    skill: "AGENT SKILL",
    prompt: "PROMPT ENGINEERING",
    repo: "TRENDING REPO",
    mcp: "MCP SERVER",
  };
  const typeLabel = typeLabels[item.type] || item.type.toUpperCase();

  ctx.font = "bold 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const typeTextWidth = ctx.measureText(typeLabel).width;
  const typeBadgeW = typeTextWidth + 24;
  const typeBadgeH = 32;
  const typeBadgeX = cardX + cardW - 36 - typeBadgeW;
  const typeBadgeY = brandMarkY + 6;

  drawRoundedRect(ctx, typeBadgeX, typeBadgeY, typeBadgeW, typeBadgeH, 6);
  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  ctx.fill();
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = isDark ? p.canvasDarkAccent : p.canvasLightAccent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(typeLabel, typeBadgeX + typeBadgeW / 2, typeBadgeY + typeBadgeH / 2);

  const leftColX = cardX + 36;
  const leftColMaxW = 730;

  let currentY = cardY + 112;

  const categoryName = item.category || (item.type === "skill" ? "Agent Skill" : item.type === "prompt" ? "Prompt Engineering" : "Developer Tools");
  ctx.font = "600 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const catWidth = ctx.measureText(categoryName.toUpperCase()).width;
  const catBadgeW = catWidth + 20;
  const catBadgeH = 28;

  drawRoundedRect(ctx, leftColX, currentY, catBadgeW, catBadgeH, 6);
  ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)";
  ctx.fill();
  ctx.strokeStyle = isDark ? p.canvasDarkBorder : p.canvasLightBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = isDark ? p.canvasDarkAccent : p.canvasLightAccent;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(categoryName.toUpperCase(), leftColX + catBadgeW / 2, currentY + catBadgeH / 2);

  if (item.author) {
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "500 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = isDark ? "#a1a1aa" : "#71717a";
    ctx.fillText(`by @${item.author.replace(/^@/, "")}`, leftColX + catBadgeW + 14, currentY + catBadgeH / 2);
  }

  currentY += catBadgeH + 26;

  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "bold 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = isDark ? "#fafafa" : "#09090b";

  const titleLines = wrapText(ctx, item.title, leftColMaxW, 2);
  for (const line of titleLines) {
    ctx.fillText(line, leftColX, currentY);
    currentY += 46;
  }

  currentY += 10;
  ctx.font = "400 18px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = isDark ? "#a1a1aa" : "#52525b";

  const descLines = wrapText(ctx, item.description, leftColMaxW, 3);
  for (const line of descLines) {
    ctx.fillText(line, leftColX, currentY);
    currentY += 28;
  }

  const statsY = cardY + cardH - 76;
  let statX = leftColX;

  const stats = item.stats && item.stats.length > 0
    ? item.stats
    : [
        { label: "Community", value: "Verified" },
        { label: "License", value: "Open Source" },
      ];

  for (const s of stats.slice(0, 4)) {
    const statText = `${s.label}: ${s.value}`;
    ctx.font = "600 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
    const statWidth = ctx.measureText(statText).width;
    const badgeW = statWidth + 24;
    const badgeH = 34;

    drawRoundedRect(ctx, statX, statsY, badgeW, badgeH, 6);
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)";
    ctx.fill();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isDark ? "#e4e4e7" : "#27272a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(statText, statX + badgeW / 2, statsY + badgeH / 2);

    statX += badgeW + 12;
  }

  const qrBoxW = 240;
  const qrBoxH = 310;
  const qrBoxX = cardX + cardW - 36 - qrBoxW;
  const qrBoxY = cardY + 112;
  const qrBoxRadius = 16;

  drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxW, qrBoxH, qrBoxRadius);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const qrDataUrl = await generateQrCodeDataUrl(canonicalUrl, "light");
  const qrImg = await loadImage(qrDataUrl);

  const qrImgSize = 190;
  const qrImgX = qrBoxX + (qrBoxW - qrImgSize) / 2;
  const qrImgY = qrBoxY + 20;
  ctx.drawImage(qrImg, qrImgX, qrImgY, qrImgSize, qrImgSize);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = "#09090b";
  ctx.fillText("SCAN TO OPEN", qrBoxX + qrBoxW / 2, qrImgY + qrImgSize + 16);

  ctx.font = "500 11px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillStyle = "#71717a";
  ctx.fillText("proskillai.dev", qrBoxX + qrBoxW / 2, qrImgY + qrImgSize + 36);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas blob conversion failed"));
      }
    }, "image/png");
  });
}

export async function downloadShareCardImage(
  item: ShareItemData,
  theme: ShareTheme,
  palette: SharePalette
): Promise<void> {
  const blob = await generateShareCardBlob(item, theme, palette);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const cleanSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  a.href = url;
  a.download = `proskillai-${cleanSlug}-${theme}-${palette}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function copyShareCardImage(
  item: ShareItemData,
  theme: ShareTheme,
  palette: SharePalette
): Promise<boolean> {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    return false;
  }
  try {
    const blob = await generateShareCardBlob(item, theme, palette);
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}
