"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Menu, X } from "lucide-react";

export function PublicHeader({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-background/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
          aria-label="ProSkillAI Home"
        >
          <svg
            className="w-6 h-6 text-foreground"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
            <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
            <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
            <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
          </svg>
          <span className="font-semibold text-base tracking-tight">ProSkillAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Main navigation">
          <Link
            href={`/${locale}/skills`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors"
          >
            {t("skills")}
          </Link>
          <Link
            href={`/${locale}/prompts`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-foreground transition-colors"
          >
            {t("prompts")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle label="Toggle theme" />

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-800 text-foreground"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("close") : t("menu")}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-background px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-sm font-medium" aria-label="Mobile navigation">
            <Link
              href={`/${locale}/skills`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 text-foreground"
            >
              {t("skills")}
            </Link>
            <Link
              href={`/${locale}/prompts`}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 text-foreground"
            >
              {t("prompts")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
