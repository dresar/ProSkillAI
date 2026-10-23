import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getStoredAiConfig, saveAiConfig, fetchBynaraModels } from "@/lib/ai";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const [config, models] = await Promise.all([
    getStoredAiConfig(),
    fetchBynaraModels(),
  ]);

  return NextResponse.json({
    config,
    models,
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await req.json();

  if (body.action === "reset_credits") {
    const amount = Number(body.amount ?? 5);
    await db.update(users).set({ aiCredits: amount, updatedAt: new Date() });
    return NextResponse.json({ success: true, message: `Semua kredit pengguna berhasil direset ke ${amount}` });
  }

  if (body.config) {
    const updated = await saveAiConfig(body.config);
    return NextResponse.json({ success: true, config: updated });
  }

  return NextResponse.json({ error: "BAD_REQUEST" }, { status: 400 });
}