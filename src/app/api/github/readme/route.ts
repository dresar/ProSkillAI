import { NextResponse } from "next/server";
import { fetchRepoReadme } from "@/lib/github-trending";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const NAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateResult = checkRateLimit(`readme_${ip}`, 60, 60000);
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateResult.resetMs / 1000).toString(),
          },
        }
      );
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");

    if (!owner || !repo || !NAME_REGEX.test(owner) || !NAME_REGEX.test(repo)) {
      return NextResponse.json(
        { error: "Invalid owner or repo parameter" },
        { status: 400 }
      );
    }

    const markdown = await fetchRepoReadme(owner, repo);

    return NextResponse.json(
      {
        owner,
        repo,
        markdown,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
          "X-RateLimit-Remaining": rateResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load README" },
      { status: 500 }
    );
  }
}
