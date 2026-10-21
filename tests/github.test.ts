import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { parseGitHubUrl, parseSkillCandidate } from "../src/lib/github";

describe("GitHub URL Parser", () => {
  test("parses plain owner/repo format", () => {
    const result = parseGitHubUrl("vercel/next.js");
    assert.equal(result.owner, "vercel");
    assert.equal(result.repo, "next.js");
    assert.equal(result.branch, undefined);
    assert.equal(result.pathFilter, undefined);
  });

  test("parses full HTTPS GitHub URL", () => {
    const result = parseGitHubUrl("https://github.com/dresar/ProSkillAI");
    assert.equal(result.owner, "dresar");
    assert.equal(result.repo, "ProSkillAI");
  });

  test("parses URL with .git extension", () => {
    const result = parseGitHubUrl("https://github.com/anthropics/anthropic-quickstarts.git");
    assert.equal(result.owner, "anthropics");
    assert.equal(result.repo, "anthropic-quickstarts");
  });

  test("parses tree subpath URL", () => {
    const result = parseGitHubUrl("https://github.com/facebook/react/tree/main/packages/react");
    assert.equal(result.owner, "facebook");
    assert.equal(result.repo, "react");
    assert.equal(result.branch, "main");
    assert.equal(result.pathFilter, "packages/react");
  });

  test("parses blob file URL", () => {
    const result = parseGitHubUrl("https://github.com/owner/repo/blob/release/skills/ui/SKILL.md");
    assert.equal(result.owner, "owner");
    assert.equal(result.repo, "repo");
    assert.equal(result.branch, "release");
    assert.equal(result.pathFilter, "skills/ui/SKILL.md");
  });

  test("parses shorthand with subpath", () => {
    const result = parseGitHubUrl("my-org/my-project/skills/creative-writing");
    assert.equal(result.owner, "my-org");
    assert.equal(result.repo, "my-project");
    assert.equal(result.pathFilter, "skills/creative-writing");
  });

  test("throws error on invalid input", () => {
    assert.throws(() => parseGitHubUrl("invalid-single-token"), /Format URL GitHub tidak valid/);
    assert.throws(() => parseGitHubUrl(""), /Format URL GitHub tidak valid/);
    assert.throws(() => parseGitHubUrl("   "), /Format URL GitHub tidak valid/);
  });
});

describe("Skill Candidate Parser", () => {
  test("uses frontmatter name and description when present", () => {
    const raw = `---
name: Web Design Master
description: Senior guidelines for clean UI.
license: MIT
---
# Content`;

    const candidate = parseSkillCandidate("skills/web/SKILL.md", "sha123", raw, "MIT");
    assert.equal(candidate.name, "Web Design Master");
    assert.equal(candidate.description, "Senior guidelines for clean UI.");
    assert.equal(candidate.isPermissive, true);
    assert.equal(candidate.licenseSpdx, "MIT");
  });

  test("falls back to directory name when name is missing from frontmatter", () => {
    const raw = `---
summary: Fallback summary
---
# Content`;

    const candidate = parseSkillCandidate("agents/skills/data-analyst/SKILL.md", "sha456", raw, "Apache-2.0");
    assert.equal(candidate.name, "data-analyst");
    assert.equal(candidate.description, "Fallback summary");
    assert.equal(candidate.isPermissive, true);
  });

  test("avoids literal SKILL.md as name when located at root", () => {
    const raw = `# Just Markdown without frontmatter`;
    const candidate = parseSkillCandidate("SKILL.md", "sha789", raw, null, "my-custom-repo");
    assert.notEqual(candidate.name, "SKILL.md");
    assert.equal(candidate.name, "my-custom-repo");
  });

  test("detects permissive license from frontmatter if repo license is null", () => {
    const raw = `---
name: Open Skill
license: Apache-2.0
---
# Content`;

    const candidate = parseSkillCandidate("SKILL.md", "sha000", raw, null, "repo");
    assert.equal(candidate.isPermissive, true);
    assert.equal(candidate.licenseSpdx, "Apache-2.0");
  });

  test("marks proprietary or unknown licenses as non-permissive", () => {
    const raw = `---
name: Proprietary Skill
---
# Secret instructions`;

    const candidate = parseSkillCandidate("SKILL.md", "sha111", raw, null, "repo");
    assert.equal(candidate.isPermissive, false);
  });
});
