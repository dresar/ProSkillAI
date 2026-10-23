import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  buildShareUrl,
  buildSocialShareUrls,
  generateQrCodeDataUrl,
  generateQrCodeSvg,
  PALETTE_CONFIGS,
  SITE_URL,
} from "../src/lib/share-utils";
import type { ShareItemData, SharePalette } from "../src/types/share";

describe("Universal Share Feature & QR Code Engine", () => {
  test("buildShareUrl normalizes paths and preserves absolute URLs", () => {
    assert.equal(
      buildShareUrl("https://example.com/item"),
      "https://example.com/item"
    );
    assert.equal(
      buildShareUrl("/en/skills/agentic-design", "https://proskillai.dev"),
      "https://proskillai.dev/en/skills/agentic-design"
    );
    assert.equal(
      buildShareUrl("id/prompts/security-audit", "https://proskillai.dev"),
      "https://proskillai.dev/id/prompts/security-audit"
    );
  });

  test("buildSocialShareUrls produces valid intent URLs for all platforms", () => {
    const item: ShareItemData = {
      type: "skill",
      title: "Clean Architecture Skill",
      description: "Standard clean coding instructions for autonomous agents.",
      url: "https://proskillai.dev/en/skills/clean-architecture",
      category: "Architecture",
      author: "dresar",
    };

    const urls = buildSocialShareUrls(item, item.url);

    assert.ok(urls.twitter.startsWith("https://twitter.com/intent/tweet?text="));
    assert.ok(urls.twitter.includes(encodeURIComponent(item.url)));
    assert.ok(urls.whatsapp.startsWith("https://api.whatsapp.com/send?text="));
    assert.ok(urls.linkedin.startsWith("https://www.linkedin.com/sharing/share-offsite/?url="));
    assert.ok(urls.telegram.startsWith("https://t.me/share/url?url="));
  });

  test("generateQrCodeDataUrl generates valid base64 PNG data URL", async () => {
    const url = "https://proskillai.dev/en/skills/react-19";
    const darkQr = await generateQrCodeDataUrl(url, "dark");
    const lightQr = await generateQrCodeDataUrl(url, "light");

    assert.ok(darkQr.startsWith("data:image/png;base64,"));
    assert.ok(lightQr.startsWith("data:image/png;base64,"));
    assert.notEqual(darkQr, lightQr);
  });

  test("generateQrCodeSvg generates valid SVG element string", async () => {
    const url = "https://proskillai.dev/en/prompts/code-review";
    const svgString = await generateQrCodeSvg(url, "dark");

    assert.ok(svgString.includes("<svg"));
    assert.ok(svgString.includes("</svg>"));
    assert.ok(svgString.includes("viewBox="));
  });

  test("PALETTE_CONFIGS defines all 6 palettes with full color stops", () => {
    const requiredPalettes: SharePalette[] = [
      "zinc",
      "emerald",
      "violet",
      "cyan",
      "amber",
      "sunset",
    ];

    for (const key of requiredPalettes) {
      const config = PALETTE_CONFIGS[key];
      assert.ok(config, `Missing palette config: ${key}`);
      assert.equal(config.id, key);
      assert.ok(config.nameEn.length > 0);
      assert.ok(config.nameId.length > 0);
      assert.ok(config.dotColor.startsWith("#"));
      assert.ok(config.darkGradient.includes("from-"));
      assert.ok(config.lightGradient.includes("from-"));
      assert.ok(config.canvasDarkBgStart.startsWith("#"));
      assert.ok(config.canvasDarkBgEnd.startsWith("#"));
      assert.ok(config.canvasLightBgStart.startsWith("#"));
      assert.ok(config.canvasLightBgEnd.startsWith("#"));
    }
  });

  test("strict /nokomen compliance in all share code files", () => {
    const filesToCheck = [
      "src/types/share.ts",
      "src/lib/share-utils.ts",
      "src/components/share/share-canvas.ts",
      "src/components/share/share-card.tsx",
      "src/components/share/share-modal.tsx",
      "src/components/share/share-button.tsx",
      "src/components/share/index.ts",
      "src/components/skill-card.tsx",
      "src/components/prompt-card.tsx",
      "src/app/[locale]/skills/[slug]/page.tsx",
      "src/app/[locale]/prompts/[slug]/page.tsx",
      "src/app/[locale]/trending/trending-client.tsx",
      "src/app/[locale]/mcp/mcp-client.tsx",
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.resolve(process.cwd(), relPath);
      assert.ok(fs.existsSync(fullPath), `File does not exist: ${relPath}`);
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        assert.ok(
          !trimmed.startsWith("//"),
          `Found forbidden comment at ${relPath}:${i + 1} -> ${trimmed}`
        );
        assert.ok(
          !trimmed.startsWith("/*") && !trimmed.startsWith("*"),
          `Found forbidden block comment at ${relPath}:${i + 1} -> ${trimmed}`
        );
        assert.ok(
          !trimmed.startsWith("<!--"),
          `Found forbidden HTML comment at ${relPath}:${i + 1} -> ${trimmed}`
        );
      }
    }
  });
});
