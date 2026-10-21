"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, MessageSquare, Shield } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function PublicMobileHeader({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBeta = useTranslations("beta");

  const isSkills = pathname.startsWith(`/${locale}/skills`);
  const isPrompts = pathname.startsWith(`/${locale}/prompts`);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const learnItems = [
    { label: tBeta("teardowns"), key: "teardowns" },
    { label: tBeta("patterns"), key: "patterns" },
    { label: tBeta("guides"), key: "guides" },
    { label: tBeta("glossary"), key: "glossary" },
  ];

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs">
      <div className="px-4 h-14 flex items-center justify-between gap-2">
        <Link
          href={`/${locale}`}
          onClick={() => setIsOpen(false)}
          className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
          aria-label="ProSkillAI Home"
        >
          <div className="w-7 h-7 rounded-md bg-foreground text-background flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-background"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <rect x="4" y="4" width="6" height="24" rx="2" fill="currentColor" />
              <rect x="12" y="4" width="14" height="6" rx="2" fill="currentColor" />
              <rect x="20" y="8" width="6" height="9" rx="2" fill="currentColor" />
              <rect x="12" y="15" width="14" height="6" rx="2" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-foreground">
            PROSKILL AI
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle label="Toggle theme" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center w-8 h-8 rounded border border-border text-foreground hover:bg-muted"
            aria-expanded={isOpen}
            aria-label={isOpen ? tNav("close") : tNav("menu")}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-border bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase block mb-1.5">
              {locale === "en" ? "Build" : "Bangun"}
            </span>
            <div className="space-y-1">
              <Link
                href={`/${locale}/skills`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium ${
                  isSkills
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tNav("skills")}</span>
                <span className="text-[10px] font-mono">Catalog</span>
              </Link>
              <Link
                href={`/${locale}/prompts`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium ${
                  isPrompts
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{tNav("prompts")}</span>
                <span className="text-[10px] font-mono">Library</span>
              </Link>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase block mb-1.5">
              {locale === "en" ? "Learn" : "Pelajari"}
            </span>
            <div className="space-y-1">
              {learnItems.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-muted-foreground cursor-not-allowed"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-muted text-muted-foreground">
                    Beta
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{tNav("admin")}</span>
            </Link>
            <a
              href="https://github.com/dresar/ProSkillAI/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "Feedback" : "Umpan Balik"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
