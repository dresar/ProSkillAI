import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { ExternalLink, LogOut } from "lucide-react";
import { destroySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export function AdminHeader({ userEmail, title }: { userEmail: string; title?: string }) {
  async function handleLogout() {
    "use server";
    await destroySession();
    redirect("/login");
  }

  return (
    <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-surface px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground tracking-tight">
          {title || "Panel Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/id"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-neutral-500 hover:text-foreground transition-colors"
        >
          <span>Situs Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <ThemeToggle label="Tema Admin" />

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

        <span className="hidden sm:inline text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">
          {userEmail}
        </span>

        <form action={handleLogout}>
          <button
            type="submit"
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-foreground cursor-pointer transition-transform active:scale-95"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </form>
      </div>
    </header>
  );
}
