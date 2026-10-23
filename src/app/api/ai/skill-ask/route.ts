import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { skills, categories, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { askSkillAi } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "Fitur Tanya AI hanya dapat diakses oleh member terdaftar. Silakan masuk ke akun Anda.",
        },
        { status: 401 }
      );
    }

    const rateResult = checkRateLimit(`ask_${user.id}`, 10, 60000);
    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          error: "RATE_LIMITED",
          message: "Terlalu banyak permintaan dalam waktu singkat. Harap tunggu beberapa detik.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateResult.resetMs / 1000).toString(),
          },
        }
      );
    }

    if (user.aiCredits <= 0) {
      return NextResponse.json(
        {
          error: "NO_CREDITS",
          message: "Kredit AI Anda telah habis (0/10). Hubungi administrator untuk penambahan kuota.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Payload tidak valid." },
        { status: 400 }
      );
    }

    const { skillId, question, locale } = body;

    if (!skillId || typeof skillId !== "string" || skillId.length > 128) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "ID skill tidak valid." },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Pertanyaan diperlukan." },
        { status: 400 }
      );
    }

    const cleanQuestion = question.trim();
    if (cleanQuestion.length < 3) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Pertanyaan minimal 3 karakter." },
        { status: 400 }
      );
    }

    if (cleanQuestion.length > 2000) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Pertanyaan maksimal 2000 karakter." },
        { status: 400 }
      );
    }

    const skillResult = await db
      .select({
        skill: skills,
        category: categories,
      })
      .from(skills)
      .leftJoin(categories, eq(skills.categoryId, categories.id))
      .where(eq(skills.id, skillId))
      .limit(1);

    if (skillResult.length === 0) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Skill tidak ditemukan." },
        { status: 404 }
      );
    }

    const item = skillResult[0];
    const isEn = locale === "en";
    const title = isEn ? item.skill.titleEn : item.skill.titleId;
    const summary = isEn ? item.skill.summaryEn : item.skill.summaryId;
    const content = isEn ? item.skill.contentEn : item.skill.contentId;
    const catName = item.category ? (isEn ? item.category.nameEn : item.category.nameId) : "";

    const skillFiles = Array.isArray(item.skill.files)
      ? (item.skill.files as Array<{ name: string; content?: string }>)
      : [];

    const aiRes = await askSkillAi({
      skillTitle: title,
      skillSummary: summary,
      skillCategory: catName,
      skillContent: content,
      skillFiles,
      question: cleanQuestion,
      locale,
    });

    const [updatedUser] = await db
      .update(users)
      .set({
        aiCredits: sql`GREATEST(0, ${users.aiCredits} - 1)`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({ aiCredits: users.aiCredits });

    return NextResponse.json({
      success: true,
      answer: aiRes.answer,
      modelUsed: aiRes.modelUsed,
      remainingCredits: updatedUser?.aiCredits ?? Math.max(0, user.aiCredits - 1),
    });
  } catch {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Gagal memproses pertanyaan ke model AI. Silakan coba kembali sesaat lagi.",
      },
      { status: 500 }
    );
  }
}