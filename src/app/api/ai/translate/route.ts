import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { translateIdToEn } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "Silakan masuk untuk menggunakan fitur auto-terjemahan AI.",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Teks yang akan diterjemahkan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const text = body.text.trim();
    if (text.length > 25000) {
      return NextResponse.json(
        { error: "PAYLOAD_TOO_LARGE", message: "Teks melebihi batas maksimal 25.000 karakter." },
        { status: 413 }
      );
    }

    const rawType = body.type;
    const type: "title" | "description" | "content" =
      rawType === "title" || rawType === "description" || rawType === "content"
        ? rawType
        : "title";

    const translatedText = await translateIdToEn({ text, type });

    return NextResponse.json({
      success: true,
      translatedText,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "TRANSLATION_FAILED",
        message: err?.message || "Gagal menerjemahkan teks melalui AI.",
      },
      { status: 500 }
    );
  }
}
