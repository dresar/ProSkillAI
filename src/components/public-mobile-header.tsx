"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Shield, LogOut, ArrowLeft } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { PublicUserNav, type PublicUser } from "./public-user-nav";
import { logoutAction } from "@/app/login/actions";

export function PublicMobileHeader({
  locale,
  user,
}: {
  locale: string;
  user?: PublicUser | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  const isSubpage = pathname !== "/" && pathname !== `/${locale}` && pathname !== `/${locale}/`;
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

  return (
    <header className="lg:hidden sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xs">
      <div className="px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {isSubpage && (
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label={locale === "en" ? "Back" : "Kembali"}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <Link
            href={`/${locale}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 text-foreground hover:opacity-85 transition-opacity"
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
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle label="Toggle theme" locale={locale} />
          <PublicUserNav user={user ?? null} locale={locale} />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
            aria-expanded={isOpen}
            aria-label={isOpen ? tNav("close") : tNav("menu")}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-border bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {user && (
            <div className="p-3 rounded-lg border border-border bg-surface flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-md bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                {user.role}
              </span>
            </div>
          )}

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

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{tNav("admin")}</span>
              </Link>

              {user && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{locale === "en" ? "Sign Out" : "Keluar"}</span>
                  </button>
                </form>
              )}
            </div>

            <FeedbackModal locale={locale} user={user} />
          </div>
        </div>
      )}
    </header>
  );
}
