"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, LogOut, Shield, Settings, ChevronDown } from "lucide-react";
import { logoutAction } from "@/app/login/actions";

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: string;
  aiCredits?: number;
}

export function PublicUserNav({
  user,
  locale,
}: {
  user: PublicUser | null;
  locale: string;
}) {
  const isEn = locale === "en";
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-foreground text-background hover:opacity-90 transition-all active:scale-95 text-xs font-semibold cursor-pointer shadow-xs shrink-0"
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>{isEn ? "Sign In" : "Masuk"}</span>
      </Link>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div ref={containerRef} className="relative inline-flex items-center shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-2 h-8 pl-1.5 pr-2 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 cursor-pointer shadow-2xs select-none"
      >
        <div className="w-5 h-5 rounded-[4px] bg-foreground text-background font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <span className="font-semibold max-w-[100px] truncate hidden md:inline">
          {user.name}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="User navigation"
          className="absolute right-0 top-full mt-1.5 w-60 rounded-xl border border-border bg-surface/98 backdrop-blur-md shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1"
        >
          <div className="px-2.5 py-2 border-b border-border/60">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-muted text-foreground border border-border/80">
                {user.role}
              </span>
              {typeof user.aiCredits === "number" && (
                <span className="text-[9px] font-mono text-blue-500">
                  {user.aiCredits} credits
                </span>
              )}
            </div>
          </div>

          {(user.role === "admin" || user.role === "editor") && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>{isEn ? "Admin Dashboard" : "Panel Admin"}</span>
            </Link>
          )}

          <Link
            href={`/${locale}/profile`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{isEn ? "Profile & Account" : "Pengaturan Akun"}</span>
          </Link>

          <div className="border-t border-border/60 pt-1">
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isEn ? "Sign Out" : "Keluar"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
