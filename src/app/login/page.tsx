import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk — ProSkillAI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-background text-foreground transition-colors">
      <header className="flex justify-between items-center max-w-sm w-full mx-auto">
        <Link href="/id" className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity">
          <BrandLogo className="w-5 h-5" size={20} />
          <span className="font-semibold text-xs tracking-tight">ProSkillAI</span>
        </Link>
        <ThemeToggle label="Ganti tema" />
      </header>

      <main className="max-w-sm w-full mx-auto my-auto py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Masuk ke Portal ProSkillAI
          </h1>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Portal akses untuk Administrator dan Pengguna terdaftar.
          </p>
        </div>

        <LoginForm />
      </main>

      <footer className="text-center text-[11px] text-muted-foreground py-2">
        <span suppressHydrationWarning>&copy; {new Date().getFullYear()} ProSkillAI. Akses terproteksi.</span>
      </footer>
    </div>
  );
}
