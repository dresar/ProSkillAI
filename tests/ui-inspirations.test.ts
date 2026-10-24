import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { FALLBACK_UI_INSPIRATIONS } from "../src/db/ui-inspirations-data";
import { getAllUiInspirations, getUiInspirationBySlug } from "../src/db/queries";

test("UI/UX Inspiration & Serverless Suite", async (t) => {
  await t.test("contains at least 12 curated UI/UX inspirations with complete metadata", () => {
    assert.ok(FALLBACK_UI_INSPIRATIONS.length >= 12);
    for (const item of FALLBACK_UI_INSPIRATIONS) {
      assert.ok(item.id.length > 0);
      assert.ok(item.slug.length > 0);
      assert.ok(item.titleEn.length > 0);
      assert.ok(item.titleId.length > 0);
      assert.ok(item.descriptionEn.length > 0);
      assert.ok(item.descriptionId.length > 0);
      assert.ok(item.componentSnippet.length > 20);
      assert.ok(item.tags && Array.isArray(item.tags));
      assert.ok(item.designTokens && typeof item.designTokens === "object");
    }
  });

  await t.test("all items use valid categories", () => {
    const validCategories = new Set(["cards", "agentic", "nav", "forms", "metrics", "modals"]);
    for (const item of FALLBACK_UI_INSPIRATIONS) {
      assert.ok(validCategories.has(item.category), `Invalid category ${item.category} in ${item.slug}`);
    }
  });

  await t.test("retrieves item by slug cleanly", async () => {
    const item = await getUiInspirationBySlug("compact-marketplace-card");
    assert.ok(item !== null);
    assert.strictEqual(item?.slug, "compact-marketplace-card");
    assert.ok(item?.componentSnippet.includes("rounded-[8px]"));
  });

  await t.test("filters inspirations by category and search", async () => {
    const agenticItems = await getAllUiInspirations({ category: "agentic" });
    assert.ok(agenticItems.length > 0);
    assert.ok(agenticItems.every((it) => it.category === "agentic"));

    const searchResults = await getAllUiInspirations({ search: "marketplace" });
    assert.ok(searchResults.length > 0);
    assert.ok(searchResults.some((it) => it.slug === "compact-marketplace-card"));
  });

  await t.test("strict /nokomen compliance in all UI inspiration files", () => {
    const filesToCheck = [
      "src/db/ui-inspirations-data.ts",
      "src/components/ui-inspiration-card.tsx",
      "src/components/ui-inspiration-catalog.tsx",
      "src/components/ui-inspiration-detail-view.tsx",
      "src/components/ui-inspiration-preview-renderer.tsx",
      "src/app/[locale]/inspirasi/page.tsx",
      "src/app/[locale]/inspirasi/[slug]/page.tsx",
      "src/app/[locale]/ui/page.tsx",
      "src/app/[locale]/ui/[slug]/page.tsx",
      "src/app/admin/design-trends/page.tsx",
      "src/app/admin/design-trends/actions.ts",
      "src/app/admin/design-trends/design-trends-client.tsx",
      "src/app/admin/design-trends/design-trend-form.tsx",
      "src/app/admin/design-trends/new/page.tsx",
      "src/app/admin/design-trends/[id]/edit/page.tsx",
      "src/app/admin/media/page.tsx",
      "src/app/admin/media/actions.ts",
      "src/app/admin/media/media-client.tsx",
      "src/components/admin/media-gallery-dialog.tsx",
      "src/components/admin/image-uploader.tsx",
      "src/app/api/inspirations/route.ts",
      "src/app/api/inspirations/[slug]/route.ts",
      "src/app/api/inspirations/[slug]/copy/route.ts",
      "src/app/api/inspirations/[slug]/like/route.ts",
    ];

    for (const file of filesToCheck) {
      const fullPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8");
        const lines = content.split("\n");
        const commentLines = lines.filter(
          (l) =>
            l.trim().startsWith("//") ||
            l.trim().startsWith("/*") ||
            l.includes("/*") ||
            l.includes("{/*")
        );
        assert.strictEqual(
          commentLines.length,
          0,
          `Found ${commentLines.length} comments in ${file}: ${commentLines.slice(0, 3).join(", ")}`
        );
      }
    }
  });
});
