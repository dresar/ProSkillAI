import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk — Panel Admin ProSkillAI",
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
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-background">
      <div className="flex justify-between items-center max-w-sm w-full mx-auto">
        <Link href="/id" className="flex items-center gap-2 text-foreground">
          <svg className="w-5 h-5 text-foreground" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
            <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
            <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
            <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
          </svg>
          <span className="font-semibold text-xs tracking-tight">ProSkillAI</span>
        </Link>
        <ThemeToggle label="Ganti tema" />
      </div>

      <div className="max-w-sm w-full mx-auto my-auto py-8">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Masuk ke Panel Admin
          </h1>
          <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
            Hanya untuk staf dan editor ProSkillAI yang terdaftar.
          </p>
        </div>

        <LoginForm />
      </div>

      <div className="text-center text-[11px] text-neutral-400 py-2">
        <span>&copy; {new Date().getFullYear()} ProSkillAI. Akses terbatas.</span>
      </div>
    </div>
  );
}
