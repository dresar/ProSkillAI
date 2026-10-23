import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getLanguageColor,
  formatCompactNumber,
  fetchGitHubTrending,
  fetchRepoReadme,
} from "../src/lib/github-trending";

describe("GitHub Trending & Readme Engine", () => {
  test("formats compact numbers accurately", () => {
    assert.equal(formatCompactNumber(500), "500");
    assert.equal(formatCompactNumber(1200), "1.2k");
    assert.equal(formatCompactNumber(25000), "25k");
    assert.equal(formatCompactNumber(234120), "234.1k");
    assert.equal(formatCompactNumber(1500000), "1.5M");
  });

  test("resolves authentic language colors with safe fallback", () => {
    assert.equal(getLanguageColor("TypeScript"), "#3178c6");
    assert.equal(getLanguageColor("Python"), "#3572A5");
    assert.equal(getLanguageColor("Rust"), "#dea584");
    assert.equal(getLanguageColor("Go"), "#00ADD8");
    assert.equal(getLanguageColor("UnknownLanguage"), "#8b949e");
  });

  test("fetches trending repositories with ranking and metadata", async () => {
    const result = await fetchGitHubTrending({ range: "all" });
    assert.ok(Array.isArray(result.repos));
    assert.ok(result.repos.length > 0);
    assert.ok(typeof result.isLive === "boolean");

    const first = result.repos[0];
    assert.equal(first.rank, 1);
    assert.ok(first.name.length > 0);
    assert.ok(first.fullName.includes("/"));
    assert.ok(typeof first.stars === "number");
    assert.ok(typeof first.forks === "number");
    assert.ok(first.owner.avatarUrl.startsWith("http"));
  });

  test("fetches repo README with graceful fallback", async () => {
    const readme = await fetchRepoReadme("facebook", "react");
    assert.ok(typeof readme === "string");
    assert.ok(readme.length > 20);
  });
});
