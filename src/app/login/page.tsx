import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
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
          <svg className="w-5 h-5 text-foreground shrink-0" width="20" height="20" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
            <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
            <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
            <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
          </svg>
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
        <span>&copy; {new Date().getFullYear()} ProSkillAI. Akses terproteksi.</span>
      </footer>
    </div>
  );
}
