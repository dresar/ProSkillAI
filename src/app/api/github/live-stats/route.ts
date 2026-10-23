import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");

  if (!repo || !repo.includes("/")) {
    return NextResponse.json({ error: "Missing or invalid repo parameter" }, { status: 400 });
  }

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ProSkillAI-LiveSync",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const [repoRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, {
        headers,
        next: { revalidate: 60 },
      }),
      fetch(`https://api.github.com/repos/${repo}/contributors?per_page=100`, {
        headers,
        next: { revalidate: 120 },
      }).catch(() => null),
    ]);

    if (!repoRes.ok) {
      return NextResponse.json({ error: "Failed to fetch repository data" }, { status: repoRes.status });
    }

    const data = await repoRes.json();
    let contributorsCount = 1;

    if (contribRes && contribRes.ok) {
      const contribs = await contribRes.json();
      if (Array.isArray(contribs)) {
        contributorsCount = contribs.length;
      }
    }

    return NextResponse.json(
      {
        stars: data.stargazers_count ?? 0,
        forks: data.forks_count ?? 0,
        contributors: contributorsCount,
        license: data.license?.spdx_id || data.license?.name || "MIT",
        lastCommit: data.pushed_at || data.updated_at,
        branch: data.default_branch || "main",
        openIssues: data.open_issues_count ?? 0,
        isLive: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
