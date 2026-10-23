"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, LogOut, Shield, Settings } from "lucide-react";
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

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] bg-foreground text-background hover:opacity-90 transition-all active:scale-95 text-xs font-medium cursor-pointer shadow-xs shrink-0"
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
    <div className="flex items-center gap-1.5 shrink-0">
      <Link
        href={`/${locale}/profile`}
        className="hidden sm:flex items-center gap-2 pl-2 pr-1.5 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted/70 text-foreground text-xs font-medium transition-colors"
        title={isEn ? "Account Settings & Profile" : "Pengaturan Akun & Profil"}
      >
        <div className="w-5 h-5 rounded-[4px] bg-foreground text-background font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
          {initials}
        </div>
        <span className="max-w-[100px] truncate">{user.name}</span>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-[4px] bg-muted text-foreground border border-border/80">
          {user.role}
        </span>
      </Link>

      <Link
        href={`/${locale}/profile`}
        className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer shrink-0"
        title={isEn ? "Profile Settings" : "Pengaturan Profil"}
      >
        <Settings className="w-3.5 h-3.5" />
      </Link>

      {(user.role === "admin" || user.role === "editor") && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-medium transition-all active:scale-95 cursor-pointer shrink-0"
          title={user.email}
        >
          <Shield className="w-3.5 h-3.5 text-foreground" />
          <span className="hidden md:inline">Panel Admin</span>
        </Link>
      )}

      <form action={logoutAction} className="inline-flex">
        <button
          type="submit"
          className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer shrink-0"
          title={isEn ? "Sign Out" : "Keluar"}
          aria-label={isEn ? "Sign Out" : "Keluar"}
        >
          <LogOut className="w-3.5 h-3.5 text-foreground" />
        </button>
      </form>
    </div>
  );
}
