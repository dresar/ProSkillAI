import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, credits: 0 });
  }

  return NextResponse.json({
    authenticated: true,
    credits: user.aiCredits,
    userId: user.id,
  });
}