import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { testAiModel, getStoredAiConfig } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { modelId } = await req.json();
    if (!modelId || typeof modelId !== "string") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "Model ID diperlukan" }, { status: 400 });
    }

    const config = await getStoredAiConfig();
    const result = await testAiModel(modelId, config);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, latencyMs: 0, message: err?.message || "Uji model gagal" },
      { status: 500 }
    );
  }
}