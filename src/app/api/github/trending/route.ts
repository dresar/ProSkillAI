import { NextResponse } from "next/server";
import { fetchGitHubTrending, type TrendingTimeRange } from "@/lib/github-trending";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = searchParams.get("range");
    const languageParam = searchParams.get("language") || "";

    const validRanges: TrendingTimeRange[] = ["daily", "weekly", "monthly", "all"];
    const range: TrendingTimeRange = validRanges.includes(rangeParam as TrendingTimeRange)
      ? (rangeParam as TrendingTimeRange)
      : "all";

    const data = await fetchGitHubTrending({
      range,
      language: languageParam,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch trending repositories" },
      { status: 500 }
    );
  }
}
