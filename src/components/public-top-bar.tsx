"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";

export function PublicTopBar({
  locale,
  user,
}: {
  locale: string;
  user: PublicUser | null;
}) {
  const isEn = locale === "en";

  return (
    <header className="hidden lg:flex h-14 shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-xs px-6 items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/skills`}
          className="inline-flex items-center gap-2 h-8 px-3 rounded-[6px] border border-border/80 bg-surface/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{isEn ? "Search skills & prompts..." : "Cari skill & prompt..."}</span>
          <kbd className="hidden xl:inline-block font-mono text-[10px] px-1 py-0.2 rounded bg-muted border border-border text-muted-foreground">
            Ctrl+K
          </kbd>
        </Link>

        <div className="hidden xl:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-foreground" />
          <span>{isEn ? "Open AI Agent Skills Registry" : "Katalog Terbuka Skill AI Agent"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle label="Toggle theme" locale={locale} />
        <div className="h-4 w-px bg-border/80" />
        <PublicUserNav user={user} locale={locale} />
      </div>
    </header>
  );
}
