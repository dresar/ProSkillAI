"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";
import { Menu, X, Plus, Star, Sparkles, Layers, Search } from "lucide-react";

interface PublicHeaderProps {
  locale: string;
  user: PublicUser | null;
}

export function PublicHeader({ locale, user }: PublicHeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isEn = locale === "en";
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isSkills = pathname === `/${locale}/skills` || pathname.startsWith(`/${locale}/skills/`);
  const isPrompts = pathname === `/${locale}/prompts` || pathname.startsWith(`/${locale}/prompts/`);
  const isFavorites = pathname === `/${locale}/favorites`;
  const isSubmit = pathname.includes("/submit");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navItems = [
    {
      href: `/${locale}/skills`,
      label: t("skills"),
      active: isSkills && !isSubmit,
      icon: Layers,
    },
    {
      href: `/${locale}/prompts`,
      label: t("prompts"),
      active: isPrompts && !isSubmit,
      icon: Sparkles,
    },
    ...(user
      ? [
          {
            href: `/${locale}/favorites`,
            label: isEn ? "Favorites" : "Favorit",
            active: isFavorites,
            icon: Star,
          },
        ]
      : []),
    {
      href: `/${locale}/skills/submit`,
      label: isEn ? "Submit" : "Kirim",
      active: isSubmit,
      icon: Plus,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
            aria-label="ProSkillAI Home"
          >
            <BrandLogo className="w-6 h-6" size={24} />
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-foreground">ProSkillAI</span>
              <span className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/80 text-muted-foreground border border-border/60">
                hub
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
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
            className="hidden lg:inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border border-border/80 bg-surface/60 hover:bg-surface text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
            title={isEn ? "Quick search skills (Press /)" : "Cari skill cepat (Tekan /)"}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">{isEn ? "Quick Search..." : "Pencarian Cepat..."}</span>
            <kbd className="text-[9px] font-mono px-1 py-0.2 rounded bg-muted border border-border/70 text-muted-foreground">
              /
            </kbd>
          </button>

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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
