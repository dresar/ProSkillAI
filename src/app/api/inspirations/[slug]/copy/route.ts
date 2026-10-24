import { NextRequest, NextResponse } from "next/server";
import { getUiInspirationBySlug, incrementUiInspirationCopy } from "@/db/queries";

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

    await incrementUiInspirationCopy(item.id);

    return NextResponse.json({ success: true, copyCount: item.copyCount + 1 }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
