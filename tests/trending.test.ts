import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getLanguageColor,
  formatCompactNumber,
  fetchGitHubTrending,
  fetchRepoReadme,
  fetchRepoDetails,
  FALLBACK_TRENDING_REPOSITORIES,
} from "../src/lib/github-trending";
import { getTrendingPreviewUrl } from "../src/lib/trending-previews";
import { checkRepoHealth } from "../src/lib/github-health-check";
import fs from "node:fs";
import path from "node:path";

describe("GitHub Trending & Readme Engine", () => {
  test("formats compact numbers accurately", () => {
    assert.equal(formatCompactNumber(0), "0");
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
    assert.equal(getLanguageColor("C++"), "#f34b7d");
    assert.equal(getLanguageColor("UnknownLanguage"), "#8b949e");
  });

  test("contains exactly 100 fallback repositories with valid schema", () => {
    assert.equal(FALLBACK_TRENDING_REPOSITORIES.length, 100);
    for (const repo of FALLBACK_TRENDING_REPOSITORIES) {
      assert.ok(typeof repo.id === "number");
      assert.ok(repo.name.length > 0);
      assert.ok(repo.fullName.includes("/"));
      assert.ok(repo.owner.login.length > 0);
      assert.ok(repo.owner.avatarUrl.startsWith("http"));
      assert.ok(typeof repo.stars === "number");
      assert.ok(typeof repo.forks === "number");
      assert.ok(repo.htmlUrl.startsWith("https://github.com/"));
      assert.ok(Array.isArray(repo.topics));
      assert.ok(repo.defaultBranch.length > 0);
    }
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

  test("supports language queries with special characters", async () => {
    const result = await fetchGitHubTrending({ range: "all", language: "C++" });
    assert.ok(Array.isArray(result.repos));
    assert.ok(result.repos.length > 0);
    if (result.isLive) {
      assert.ok(result.repos.some((r) => r.language === "C++"));
    }
  });

  test("fetches repo README with graceful fallback", async () => {
    const readme = await fetchRepoReadme("facebook", "react");
    assert.ok(typeof readme === "string");
    assert.ok(readme.length > 20);
  });

  test("fetches repo details with fallback or live API", async () => {
    const details = await fetchRepoDetails("facebook", "react");
    assert.ok(details !== null);
    assert.equal(details.name, "react");
    assert.ok(details.fullName.toLowerCase().includes("react"));
    assert.ok(typeof details.stars === "number");
    assert.ok(typeof details.forks === "number");
    assert.ok(details.owner.avatarUrl.length > 0);
  });

  test("resolves local GitHub preview image without CDN dependency", () => {
    const previewUrl = getTrendingPreviewUrl("codecrafters-io/build-your-own-x");
    assert.equal(previewUrl, "/images/trending/codecrafters-io--build-your-own-x.png");

    const pngFile = path.resolve(process.cwd(), "public", "images", "trending", "codecrafters-io--build-your-own-x.png");
    assert.ok(fs.existsSync(pngFile), "Local GitHub PNG preview must exist");
  });

  test("auto-detects repository health and archival status", async () => {
    const active = await checkRepoHealth("codecrafters-io/build-your-own-x");
    assert.equal(active.fullName, "codecrafters-io/build-your-own-x");
    assert.equal(active.isArchived, false);
    assert.equal(active.status, "active");

    const archived = await checkRepoHealth("morluto/rea");
    assert.equal(archived.fullName, "morluto/rea");
    assert.equal(archived.isArchived, true);
    assert.equal(archived.status, "archived");

    const deleted = await checkRepoHealth("nonexistent-user-12345/nonexistent-repo-98765");
    assert.equal(deleted.isArchived, true);
    assert.equal(deleted.status, "deleted");
  });
});
