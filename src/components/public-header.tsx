"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";
import { Menu, X, Search } from "lucide-react";

interface PublicHeaderProps {
  locale: string;
  user: PublicUser | null;
}

export function PublicHeader({ locale, user }: PublicHeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isEn = locale === "en";
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isSkills = pathname === `/${locale}/skills` || (pathname.startsWith(`/${locale}/skills/`) && !pathname.includes("/submit"));
  const isPrompts = pathname === `/${locale}/prompts` || (pathname.startsWith(`/${locale}/prompts/`) && !pathname.includes("/submit"));
  const isTrending = pathname === `/${locale}/trending` || pathname.startsWith(`/${locale}/trending/`);
  const isMcp = pathname === `/${locale}/mcp` || pathname.startsWith(`/${locale}/mcp/`);
  const isFavorites = pathname === `/${locale}/favorites`;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const el = document.getElementById("catalog-search-input");
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.location.href = `/${locale}/skills`;
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, locale]);

  const navLinks = [
    {
      href: `/${locale}/skills`,
      label: isEn ? "Skills" : "Skill",
      active: isSkills,
    },
    {
      href: `/${locale}/prompts`,
      label: isEn ? "Prompts" : "Prompt",
      active: isPrompts,
    },
    {
      href: `/${locale}/trending`,
      label: isEn ? "Trending" : "Trending",
      active: isTrending,
    },
    {
      href: `/${locale}/mcp`,
      label: isEn ? "MCP Servers" : "Server MCP",
      active: isMcp,
    },
    ...(user
      ? [
          {
            href: `/${locale}/favorites`,
            label: isEn ? "Favorites" : "Favorit",
            active: isFavorites,
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
            aria-label="ProSkillAI Home"
          >
            <BrandLogo className="w-6 h-6" size={24} />
            <span className="font-bold text-sm sm:text-base tracking-tight text-foreground flex items-center">
              ProSkillAI<span className="text-[9px] font-mono ml-0.5 text-muted-foreground">™</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-muted-foreground" aria-label="Main navigation">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  item.active
                    ? "text-foreground font-semibold"
                    : "hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("catalog-search-input");
              if (el) {
                el.focus();
                el.scrollIntoView({ behavior: "smooth", block: "center" });
              } else {
                window.location.href = `/${locale}/skills`;
              }
            }}
            className="hidden lg:inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border border-border bg-surface text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
            title={isEn ? "Search skills (⌘K)" : "Cari skill (⌘K)"}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px] text-muted-foreground">
              {isEn ? "Search 27+ skills..." : "Cari 27+ skill..."}
            </span>
            <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted border border-border/70 text-muted-foreground ml-1">
              ⌘K
            </kbd>
          </button>

          <Link
            href={`/${locale}/skills/submit`}
            className="inline-flex items-center justify-center h-8 px-3 rounded-[6px] bg-foreground text-background text-[11px] font-bold tracking-wider uppercase hover:opacity-90 transition-all active:scale-95 shadow-xs shrink-0"
          >
            {isEn ? "SUBMIT A SKILL" : "KIRIMKAN SKILL"}
          </Link>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle label="Toggle theme" locale={locale} />

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          <PublicUserNav user={user} locale={locale} />

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("close") : t("menu")}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1.5 animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                  item.active
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
