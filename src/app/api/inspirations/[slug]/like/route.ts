import { NextRequest, NextResponse } from "next/server";
import { getUiInspirationBySlug, incrementUiInspirationLike } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const item = await getUiInspirationBySlug(slug);

    if (!item) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    await incrementUiInspirationLike(item.id);

    return NextResponse.json({ success: true, likesCount: item.likesCount + 1 }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
