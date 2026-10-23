import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllCategories } from "@/db/queries";
import { getCurrentUser } from "@/lib/auth";
import { SubmitPromptClient } from "./submit-prompt-client";

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
      ? "Submit AI Prompt Template | ProSkillAI"
      : "Kirim Templat Prompt AI | ProSkillAI",
    description: isEn
      ? "Submit your custom AI prompt engineering instructions or reasoning workflow to the open library."
      : "Daftarkan templat prompt AI atau alur instruksi sistem Anda ke pustaka terbuka.",
  };
}

export default async function SubmitPromptPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [categories, user] = await Promise.all([
    getAllCategories("prompt"),
    getCurrentUser(),
  ]);

  if (!user) {
    redirect(`/login?redirect=/${locale}/prompts/submit`);
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
      <SubmitPromptClient categories={categories} locale={locale} user={sessionUser} />
    </div>
  );
}
