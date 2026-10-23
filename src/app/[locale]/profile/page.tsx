import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { skills, prompts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ProfileClient } from "./profile-client";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Account Settings & Profile — ProSkillAI"
      : "Pengaturan Akun & Profil — ProSkillAI",
    description: isEn
      ? "Manage your ProSkillAI account credentials, display name, and security."
      : "Kelola profil akun, nama tampilan, dan kata sandi ProSkillAI Anda.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/${locale}/profile`);
  }

  const [skillsRes, promptsRes] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(skills)
      .where(eq(skills.createdBy, user.id)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(prompts)
      .where(eq(prompts.createdBy, user.id)),
  ]);

  const skillsCount = Number(skillsRes[0]?.count ?? 0);
  const promptsCount = Number(promptsRes[0]?.count ?? 0);

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    aiCredits: user.aiCredits,
    createdAt: user.createdAt,
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4">
      <ProfileClient
        user={serializedUser}
        stats={{ skillsCount, promptsCount }}
        locale={locale}
      />
    </div>
  );
}
