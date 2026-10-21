import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { highlightCode } from "../src/lib/shiki";

describe("Shiki Monochrome Highlighter", () => {
  test("highlights typescript code using monochrome theme", async () => {
    const code = "const message: string = 'Hello ProSkillAI';";
    const html = await highlightCode(code, "typescript");

    assert.ok(html.includes("class=\"shiki proskill-monochrome\""));
    assert.ok(html.includes("const"));
    assert.ok(html.includes("Hello ProSkillAI"));
  });

  test("handles bash code blocks", async () => {
    const code = "git clone https://github.com/dresar/ProSkillAI.git";
    const html = await highlightCode(code, "bash");

    assert.ok(html.includes("class=\"shiki proskill-monochrome\""));
    assert.ok(html.includes("clone"));
  });

  test("falls back cleanly on unknown language", async () => {
    const code = "some random syntax snippet";
    const html = await highlightCode(code, "unsupported_xyz_lang");

    assert.ok(html.includes("class=\"shiki proskill-monochrome\"") || html.includes("<pre><code>"));
    assert.ok(html.includes("some random syntax snippet"));
  });
});
