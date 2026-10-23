import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth";
import { FavoritesClient } from "./favorites-client";

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
      ? "Starred & Favorited Items | ProSkillAI"
      : "Skill & Prompt Favorit | ProSkillAI",
    description: isEn
      ? "Your personal collection of saved AI agent skills and prompt engineering templates."
      : "Koleksi pribadi skill AI agent dan templat prompt favorit yang Anda simpan.",
  };
}

export default async function FavoritesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/${locale}/favorites`);
  }

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
      <FavoritesClient locale={locale} />
    </div>
  );
}
