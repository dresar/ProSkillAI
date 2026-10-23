import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { skills, categories, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { askSkillAi } from "@/lib/ai";

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

    if (user.aiCredits <= 0) {
      return NextResponse.json(
        {
          error: "NO_CREDITS",
          message: "Kredit AI Anda telah habis (0/5). Hubungi administrator untuk penambahan kuota.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { skillId, question, locale } = body;

    if (!skillId || typeof skillId !== "string") {
      return NextResponse.json({ error: "BAD_REQUEST", message: "ID skill diperlukan." }, { status: 400 });
    }

    if (!question || typeof question !== "string" || question.trim().length < 3) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Pertanyaan minimal 3 karakter." },
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
      return NextResponse.json({ error: "NOT_FOUND", message: "Skill tidak ditemukan." }, { status: 404 });
    }

    const item = skillResult[0];
    const isEn = locale === "en";
    const title = isEn ? item.skill.titleEn : item.skill.titleId;
    const summary = isEn ? item.skill.summaryEn : item.skill.summaryId;
    const content = isEn ? item.skill.contentEn : item.skill.contentId;
    const catName = item.category ? (isEn ? item.category.nameEn : item.category.nameId) : "";

    const aiRes = await askSkillAi({
      skillTitle: title,
      skillSummary: summary,
      skillCategory: catName,
      skillContent: content,
      question: question.trim(),
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
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: err?.message || "Gagal memproses pertanyaan ke model AI.",
      },
      { status: 500 }
    );
  }
}