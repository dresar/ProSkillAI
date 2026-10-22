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
    <header className="h-14 shrink-0 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between gap-4 relative z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-foreground tracking-tight">
          {title || "Panel Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <Link
          href="/id"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Situs Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <ThemeToggle label="Tema Admin" />

        <div className="h-4 w-px bg-border" />

        <span className="hidden sm:inline text-muted-foreground font-mono text-[11px]">
          {userEmail}
        </span>

        <form action={handleLogout}>
          <button
            type="submit"
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded border border-border bg-surface hover:bg-muted text-foreground cursor-pointer transition-transform active:scale-95"
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
