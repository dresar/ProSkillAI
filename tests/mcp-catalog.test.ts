import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  MCP_CATEGORIES,
  MCP_SERVERS_CATALOG,
  MCP_CATALOG_STATS,
} from "../src/data/mcp-catalog";

describe("MCP Servers Directory & Agent Stack Index", () => {
  test("contains exactly 139 MCP servers", () => {
    assert.equal(MCP_SERVERS_CATALOG.length, 139);
    assert.equal(MCP_CATALOG_STATS.totalServers, 139);
  });

  test("contains exactly 11 categories matching specification", () => {
    assert.equal(MCP_CATEGORIES.length, 11);
    assert.equal(MCP_CATALOG_STATS.totalCategories, 11);

    const categoryKeys = new Set(MCP_CATEGORIES.map((c) => c.key));
    assert.ok(categoryKeys.has("frameworks"));
    assert.ok(categoryKeys.has("sandboxes"));
    assert.ok(categoryKeys.has("observability"));
    assert.ok(categoryKeys.has("memory"));
    assert.ok(categoryKeys.has("dev-tools"));
    assert.ok(categoryKeys.has("databases"));
    assert.ok(categoryKeys.has("browsing"));
    assert.ok(categoryKeys.has("filesystem"));
    assert.ok(categoryKeys.has("ai-gateways"));
    assert.ok(categoryKeys.has("collaboration"));
    assert.ok(categoryKeys.has("search"));
  });

  test("contains exactly 33 open source servers", () => {
    const ossCount = MCP_SERVERS_CATALOG.filter((s) => s.isOpenSource).length;
    assert.equal(ossCount, 33);
    assert.equal(MCP_CATALOG_STATS.openSourceCount, 33);
  });

  test("contains exactly 41 self-hostable servers", () => {
    const selfHostCount = MCP_SERVERS_CATALOG.filter((s) => s.isSelfHostable).length;
    assert.equal(selfHostCount, 41);
    assert.equal(MCP_CATALOG_STATS.selfHostableCount, 41);
  });

  test("validates required schema and Claude JSON snippet on all items", () => {
    for (const server of MCP_SERVERS_CATALOG) {
      assert.ok(server.id.length > 0);
      assert.ok(server.name.length > 0);
      assert.ok(server.slug.length > 0);
      assert.ok(server.vendor.length > 0);
      assert.ok(server.description.length > 10);
      assert.ok(Array.isArray(server.tools));
      assert.ok(server.tools.length > 0);
      assert.ok(server.installSnippet.startsWith("npx -y"));

      const parsedConfig = JSON.parse(server.claudeConfigSnippet);
      assert.ok(parsedConfig.mcpServers);
      assert.ok(parsedConfig.mcpServers[server.slug]);
      assert.equal(parsedConfig.mcpServers[server.slug].command, "npx");
    }
  });

  test("verifies all 11 category SVG cover banners exist in public/images/mcp/", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");

    for (const cat of MCP_CATEGORIES) {
      const svgPath = path.join(process.cwd(), "public", "images", "mcp", `${cat.key}.svg`);
      assert.ok(fs.existsSync(svgPath), `Missing SVG banner for category: ${cat.key}`);
      const content = fs.readFileSync(svgPath, "utf8");
      assert.ok(content.includes("<svg"), `Invalid SVG file for category: ${cat.key}`);
    }
  });
});
