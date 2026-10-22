import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const found = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);

  const skill = found[0];
  if (!skill) {
    return new NextResponse("Skill not found", { status: 404 });
  }

  const lang = request.nextUrl.searchParams.get("lang") || "id";
  const content = lang === "en" ? skill.contentEn : skill.contentId;

  return new NextResponse(content || skill.contentId, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Disposition": `inline; filename="${skill.slug}.md"`,
    },
  });
}
