import { test, describe } from "node:test";
import assert from "node:assert/strict";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolvePromptVariables(
  template: string,
  values: Record<string, string>
): string {
  let result = template;
  for (const [key, val] of Object.entries(values)) {
    if (val.trim()) {
      const regex = new RegExp(`\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}`, "g");
      result = result.replace(regex, val);
    }
  }
  return result;
}

function discoverVariables(template: string): string[] {
  const vars = new Set<string>();
  const matches = template.matchAll(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g);
  for (const m of matches) {
    vars.add(m[1]);
  }
  return Array.from(vars);
}

describe("Prompt Variable Engine", () => {
  test("substitutes declared variables", () => {
    const template = "Buatkan landing page untuk {{product_name}} dengan fitur {{feature}}.";
    const values = {
      product_name: "ProSkillAI",
      feature: "anti-slop catalog",
    };

    const resolved = resolvePromptVariables(template, values);
    assert.equal(
      resolved,
      "Buatkan landing page untuk ProSkillAI dengan fitur anti-slop catalog."
    );
  });

  test("handles whitespace variations inside brackets", () => {
    const template = "Hello {{ name }}, welcome to {{   site   }}!";
    const values = { name: "Alice", site: "ProSkillAI" };
    const resolved = resolvePromptVariables(template, values);
    assert.equal(resolved, "Hello Alice, welcome to ProSkillAI!");
  });

  test("preserves placeholders when values are empty", () => {
    const template = "Deploy to {{target}} using {{branch}}.";
    const values = { target: "Vercel", branch: "" };
    const resolved = resolvePromptVariables(template, values);
    assert.equal(resolved, "Deploy to Vercel using {{branch}}.");
  });

  test("escapes regex special characters safely", () => {
    const template = "Run {{test.env}} on {{app-server}}.";
    const values = { "test.env": "production", "app-server": "sgp1" };
    const resolved = resolvePromptVariables(template, values);
    assert.equal(resolved, "Run production on sgp1.");
  });

  test("discovers variables from arbitrary template", () => {
    const template = "Create {{role}} agent with {{skill_1}} and {{skill_2}} and {{role}} again.";
    const vars = discoverVariables(template);
    assert.deepEqual(vars, ["role", "skill_1", "skill_2"]);
  });
});
