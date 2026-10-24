import { NextRequest, NextResponse } from "next/server";
import { checkRepoHealth, batchCheckRepoHealth } from "@/lib/github-health-check";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get("repo");

    if (!repo) {
      return NextResponse.json({ success: false, error: "Missing repo query parameter" }, { status: 400 });
    }

    const result = await checkRepoHealth(repo);
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const repos = Array.isArray(body?.repos) ? body.repos : [];

    if (repos.length === 0) {
      return NextResponse.json({ success: false, error: "Empty repos array" }, { status: 400 });
    }

    const results = await batchCheckRepoHealth(repos);
    return NextResponse.json({ success: true, total: Object.keys(results).length, results }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
