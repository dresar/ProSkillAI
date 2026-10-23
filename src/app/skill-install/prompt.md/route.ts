import { NextResponse } from "next/server";

export async function GET() {
  const content = `# Install selected Agent Skills from GitHub

These are Skills.biz.id instructions for installing Agent Skills from the source URL supplied in the user's prompt. The URL may point to a GitHub repository, a Skill directory, or a SKILL.md file. Use the user's language when explaining your findings and results.

Skills helps people discover public Skill sources. It does not install files on the user's device or certify a repository as safe, functional, maintained, or compatible.

## 1. Inspect the current source

Resolve the supplied URL to its repository and relevant Skill directories, preserving any branch or revision specified in the URL. Identify the actual SKILL.md files and the complete directory belonging to each selected Skill. Record the source revision when available.

If the user explicitly selected a Skill, including by supplying its directory or SKILL.md URL, inspect only that Skill, its required companion files and dependencies, and relevant repository documentation. Do not scan or install unrelated Skills. If the URL points to the repository and no Skills have been selected, find the available Skills so the user can choose.

If the repository root or a relevant Skill directory has a README, read its purpose, dependencies, and installation instructions, following relevant documentation links as needed. If there is no README, continue by inspecting SKILL.md and its companion files. A README is helpful, but is not required.

## 2. Install the Skill into the Agent Environment

Depending on the AI agent environment in use:
- **Claude Code**: Run \`/skills add <github-url>\` or copy the skill folder into \`~/.claude/skills/<skill-name>/\`.
- **Antigravity**: Copy the skill folder into \`.agents/skills/<skill-name>/\` or run \`agy skill add <github-url>\`.
- **Cursor / Windsurf**: Place the skill into \`.cursor/skills/<skill-name>/\` or workspace root.
- **npx skills CLI**: Run \`npx skills add <owner/repo>\`.

Confirm that SKILL.md is valid, has valid YAML frontmatter, and all auxiliary reference files are in place.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
