"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";
import { logoutAction } from "@/app/login/actions";
import {
  Menu,
  X,
  Search,
  Sparkles,
  Layers,
  Terminal,
  Server,
  Star,
  Plus,
  Shield,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";

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

  React.useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  const navLinks = [
    {
      href: `/${locale}/skills`,
      label: isEn ? "Skills" : "Skill",
      active: isSkills,
      icon: Layers,
    },
    {
      href: `/${locale}/prompts`,
      label: isEn ? "Prompts" : "Prompt",
      active: isPrompts,
      icon: Terminal,
    },
    {
      href: `/${locale}/trending`,
      label: isEn ? "Trending" : "Trending",
      active: isTrending,
      icon: Sparkles,
    },
    {
      href: `/${locale}/mcp`,
      label: isEn ? "MCP Servers" : "Server MCP",
      active: isMcp,
      icon: Server,
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
  ];

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-6 lg:gap-8 min-w-0">
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity shrink-0"
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
                  className={`transition-colors whitespace-nowrap ${
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

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
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
              className="hidden xl:inline-flex items-center gap-2 h-8 px-2.5 rounded-[6px] border border-border bg-surface text-muted-foreground hover:text-foreground text-xs whitespace-nowrap transition-colors cursor-pointer"
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
              className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-[6px] bg-foreground text-background text-[11px] font-bold tracking-wider uppercase hover:opacity-90 transition-all active:scale-95 shadow-xs shrink-0"
            >
              {isEn ? "SUBMIT A SKILL" : "KIRIM SKILL"}
            </Link>

            <div className="h-4 w-px bg-border/60 hidden sm:block" />

            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle label="Toggle theme" locale={locale} />

            <div className="hidden sm:block">
              <PublicUserNav user={user} locale={locale} />
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
              aria-expanded={mobileOpen}
              aria-label={t("menu")}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-surface border-l border-border p-4 sm:p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/70">
                <Link
                  href={`/${locale}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-foreground font-bold text-sm tracking-tight"
                >
                  <BrandLogo className="w-5 h-5" size={20} />
                  <span>ProSkillAI</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-7 h-7 rounded-[5px] border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  aria-label={t("close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={`/${locale}/skills/submit`}
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 h-9 px-3 rounded-[6px] bg-foreground text-background text-xs font-bold tracking-wider uppercase hover:opacity-90 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>{isEn ? "Submit a Skill" : "Kirimkan Skill"}</span>
              </Link>

              <nav className="flex flex-col space-y-1" aria-label="Mobile drawer navigation">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        item.active
                          ? "bg-muted text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border/70 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[4px] bg-foreground text-background font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
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
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>{isEn ? "Admin Dashboard" : "Panel Admin"}</span>
                    </Link>
                  )}

                  <Link
                    href={`/${locale}/profile`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span>{isEn ? "Profile & Account" : "Pengaturan Akun"}</span>
                  </Link>

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{isEn ? "Sign Out" : "Keluar"}</span>
                    </button>
                  </form>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 h-9 px-3 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground text-xs font-semibold transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isEn ? "Sign In" : "Masuk"}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
