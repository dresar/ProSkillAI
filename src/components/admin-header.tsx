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
    <header className="h-14 shrink-0 border-b border-border/80 bg-surface/95 backdrop-blur-xs px-4 sm:px-6 flex items-center justify-between gap-4 relative z-20">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
        <h1 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
          {title || "Panel Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 text-xs">
        <Link
          href="/id"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-colors"
        >
          <span>Situs Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <ThemeToggle label="Tema Admin" />

        <div className="h-4 w-px bg-border" />

        <div className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] border border-border/80 bg-muted/30 font-mono text-[11px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/60" />
          <span className="truncate max-w-[180px]">{userEmail}</span>
        </div>

        <form action={handleLogout}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[6px] border border-border hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500 text-muted-foreground text-xs font-medium cursor-pointer transition-colors active:scale-95"
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
