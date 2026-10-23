"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";
import { usePublicSidebar } from "./public-sidebar-context";

export function PublicTopBar({
  locale,
  user,
}: {
  locale: string;
  user: PublicUser | null;
}) {
  const { collapsed, toggleSidebar } = usePublicSidebar();
  const isEn = locale === "en";

  return (
    <header className="hidden lg:flex h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur-xs px-6 items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border bg-surface/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
          aria-label={isEn ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : (collapsed ? "Perlebar sidebar" : "Ciutkan sidebar")}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <LanguageSwitcher currentLocale={locale} />
        <ThemeToggle label="Toggle theme" locale={locale} />
        <div className="h-4 w-px bg-border" />
        <PublicUserNav user={user} locale={locale} />
      </div>
    </header>
  );
}
