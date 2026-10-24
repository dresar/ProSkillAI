import { NextRequest, NextResponse } from "next/server";
import { getAllUiInspirations } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortParam = searchParams.get("sort");
    const sort = sortParam === "popular" || sortParam === "copied" || sortParam === "newest" ? sortParam : "newest";

    const items = await getAllUiInspirations({ category, search, sort });

    return NextResponse.json(
      {
        success: true,
        total: items.length,
        items,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
