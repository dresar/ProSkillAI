import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk — ProSkillAI",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) {
    const params = await searchParams;
    const target = params?.redirect;
    const isSafeTarget =
      typeof target === "string" && target.startsWith("/") && !target.startsWith("//");

    if (user.role === "admin" || user.role === "editor") {
      redirect(isSafeTarget ? target : "/admin");
    } else {
      redirect(isSafeTarget && !target.startsWith("/admin") ? target : "/id");
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 bg-background text-foreground transition-colors relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[110px] opacity-35 dark:opacity-40 pointer-events-none transition-all duration-500"
          style={{ background: "radial-gradient(ellipse at center, var(--accent) 0%, transparent 70%)" }}
        />
        <div className="absolute inset-0 bg-grid-lines bg-grid-mask pointer-events-none transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50 pointer-events-none" />
      </div>

      <header className="flex justify-between items-center max-w-md w-full mx-auto relative z-50">
        <Link
          href="/id"
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-border/80 bg-surface/80 hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 shadow-2xs backdrop-blur-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/id" className="flex items-center gap-2 text-foreground hover:opacity-85 transition-opacity mr-1">
            <BrandLogo className="w-5 h-5" size={20} />
            <span className="font-bold text-xs tracking-wider uppercase">ProSkillAI</span>
          </Link>
          <ThemeToggle label="Ganti tema" />
        </div>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        <div className="rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Masuk ke Portal ProSkillAI
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Masuk untuk mengirim skill, menyimpan favorit, dan mengelola koleksi prompt Anda.
            </p>
          </div>

          <LoginForm />
        </div>
      </main>

      <footer className="text-center text-[11px] text-muted-foreground py-2 relative z-10">
        <span suppressHydrationWarning>&copy; {new Date().getFullYear()} ProSkillAI. Akses terproteksi.</span>
      </footer>
    </div>
  );
}
