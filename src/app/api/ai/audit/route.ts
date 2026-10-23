import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { auditPromptOrSkill } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      return NextResponse.json(
        {
          error: "FORBIDDEN",
          message: "Fitur Audit Cerdas AI hanya dapat diakses oleh Administrator & Editor.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.title !== "string" || typeof body.content !== "string") {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Judul dan konten diperlukan untuk audit AI." },
        { status: 400 }
      );
    }

    const targetType = body.targetType === "skill" ? "skill" : "prompt";
    const title = body.title.trim();
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const content = body.content.trim();
    const files = Array.isArray(body.files) ? body.files : [];

    if (!title || !content) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Judul dan konten tidak boleh kosong." },
        { status: 400 }
      );
    }

    const result = await auditPromptOrSkill({
      targetType,
      title,
      description,
      content,
      files,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "AUDIT_FAILED",
        message: err?.message || "Gagal menjalankan audit AI.",
      },
      { status: 500 }
    );
  }
}
