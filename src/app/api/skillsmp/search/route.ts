import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const sortBy = searchParams.get("sortBy") || "stars";
  const category = searchParams.get("category");

  if (!q.trim()) {
    return NextResponse.json(
      { success: false, error: "Missing required query parameter 'q'" },
      { status: 400 }
    );
  }

  const apiKey = process.env.SKILLSMP_API_KEY || "";
  const targetUrl = new URL("https://skillsmp.com/api/v1/skills/search");
  targetUrl.searchParams.set("q", q);
  targetUrl.searchParams.set("page", page);
  targetUrl.searchParams.set("limit", limit);
  targetUrl.searchParams.set("sortBy", sortBy);
  if (category) {
    targetUrl.searchParams.set("category", category);
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { success: false, status: res.status, error: errText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch from SkillsMP";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
