import { NextResponse } from "next/server";
import { fetchGitHubTrending, type TrendingTimeRange } from "@/lib/github-trending";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateResult = checkRateLimit(`trending_${ip}`, 60, 60000);
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
        "X-RateLimit-Remaining": rateResult.remaining.toString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch trending repositories" },
      { status: 500 }
    );
  }
}
