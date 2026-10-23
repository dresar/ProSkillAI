import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth";
import { SubmitClient } from "./submit-client";

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
      ? "Submit AI Agent Skill | ProSkillAI"
      : "Kirim Skill AI Agent | ProSkillAI",
    description: isEn
      ? "Submit your custom AI agent instructions, coding guidelines, or tools to the open registry."
      : "Daftarkan instruksi sistem, aturan agent koding, atau perkakas AI buatan Anda ke katalog terbuka.",
  };
}

export default async function SubmitSkillPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, user] = await Promise.all([
    getAllCategories("skill"),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect(`/login?redirect=/${locale}/skills/submit`);
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
      <SubmitClient categories={categories} locale={locale} user={sessionUser} />
    </div>
  );
}
