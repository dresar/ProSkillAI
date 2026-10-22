import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COLOR_THEMES, type ColorTheme } from "../src/components/theme-provider";

describe("Aesthetic Color Themes Specification", () => {
  const expectedThemes: ColorTheme[] = [
    "noir",
    "cyber",
    "emerald",
    "indigo",
    "amber",
    "rose",
    "slate",
    "aurora",
    "neon",
    "espresso",
  ];

  test("defines exactly 10 aesthetic themes", () => {
    assert.equal(COLOR_THEMES.length, 10);
    const ids = COLOR_THEMES.map((t) => t.id);
    for (const expected of expectedThemes) {
      assert.ok(ids.includes(expected), `Missing theme: ${expected}`);
    }
  });

  test("each theme has valid visual tokens and localized names", () => {
    for (const theme of COLOR_THEMES) {
      assert.ok(theme.id.length > 0);
      assert.ok(theme.name.length > 0);
      assert.ok(theme.nameId.length > 0);
      assert.match(theme.color, /^#[0-9a-fA-F]{6}$/);
      assert.match(theme.accent, /^#[0-9a-fA-F]{6}$/);
      assert.match(theme.border, /^#[0-9a-fA-F]{6}$/);
    }
  });

  test("globals.css defines all 10 themes and grid styles", () => {
    const cssPath = path.resolve(process.cwd(), "src/app/globals.css");
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    for (const themeId of expectedThemes) {
      assert.ok(
        cssContent.includes(`data-theme="${themeId}"`),
        `globals.css missing definition for data-theme="${themeId}"`
      );
    }

    assert.ok(cssContent.includes(".bg-grid-lines"));
    assert.ok(cssContent.includes(".bg-grid-mask"));
    assert.ok(cssContent.includes("--color-accent-glow"));
    assert.ok(cssContent.includes("--color-line"));
  });
});
