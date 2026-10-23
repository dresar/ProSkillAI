"use client";

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
  return (
    <header className="hidden lg:flex h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur-xs px-6 items-center justify-end gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-2.5 shrink-0">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle label="Toggle theme" locale={locale} />
        <div className="h-4 w-px bg-border" />
        <PublicUserNav user={user} locale={locale} />
      </div>
    </header>
  );
}
