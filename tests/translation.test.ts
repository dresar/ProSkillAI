import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("AI Translation & Variable Preservation", () => {
  test("preserves bracket variable placeholders intact", () => {
    const rawTemplate = "Audit repositori [nama_repo] yang menggunakan [framework] untuk celah keamanan.";
    const matches = rawTemplate.match(/\[([a-zA-Z0-9_\-\s]+)\]/g) || [];
    assert.deepEqual(matches, ["[nama_repo]", "[framework]"]);
  });

  test("derives clean slug from title", () => {
    const title = "Master Codebase Security Audit Prompt";
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    assert.equal(slug, "master-codebase-security-audit-prompt");
  });

  test("handles empty English field fallback", () => {
    const titleId = "Prompt Arsitektur Bersih";
    const titleEn = "";
    const resolvedTitle = titleEn.trim() || titleId;
    assert.equal(resolvedTitle, "Prompt Arsitektur Bersih");
  });
});
