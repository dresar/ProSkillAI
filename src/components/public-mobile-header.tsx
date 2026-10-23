"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X, Shield, LogOut, Star, Plus, Sparkles, LogIn, FileCode, Layers, Bot, Settings } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { type PublicUser } from "./public-user-nav";
import { logoutAction } from "@/app/login/actions";

export function PublicMobileHeader({
  locale,
  user,
}: {
  locale: string;
  user?: PublicUser | null;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const isEn = locale === "en";

  const isSkills = pathname.startsWith(`/${locale}/skills`);
  const isPrompts = pathname.startsWith(`/${locale}/prompts`);
  const isFavorites = pathname.startsWith(`/${locale}/favorites`);
  const isSubmitSkill = pathname.startsWith(`/${locale}/skills/submit`);
  const isSubmitPrompt = pathname.startsWith(`/${locale}/prompts/submit`);

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
      <div className="px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer shrink-0"
          aria-expanded={isOpen}
          aria-label={isOpen ? tNav("close") : tNav("menu")}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle label="Toggle theme" locale={locale} />
        </div>
      </div>

      {isOpen && (
        <div className="border-b border-border bg-background px-4 py-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          {user ? (
            <div className="p-3 rounded-lg border border-border bg-surface space-y-2.5">
              <Link
                href={`/${locale}/profile`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                    {user.role}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {typeof user.aiCredits === "number" ? `${user.aiCredits}/5 AI` : ""}
                  </span>
                </div>
              </Link>

              <div className="pt-2 border-t border-border/60">
                <Link
                  href={`/${locale}/profile`}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 h-7 px-2.5 rounded-[5px] border border-border bg-muted/50 text-foreground text-xs font-medium hover:bg-muted active:scale-95 transition-all"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{isEn ? "Account Settings & Profile" : "Pengaturan Akun & Profil"}</span>
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 h-8 rounded-[6px] bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-95 transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEn ? "Sign In to Account" : "Masuk ke Akun"}</span>
            </Link>
          )}

          <div>
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase block mb-1.5">
              {isEn ? "Explore" : "Jelajah"}
            </span>
            <div className="space-y-1">
              <Link
                href={`/${locale}/skills`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                  isSkills && !isSubmitSkill
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>{tNav("skills")}</span>
              </Link>
              <Link
                href={`/${locale}/prompts`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                  isPrompts && !isSubmitPrompt
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span>{tNav("prompts")}</span>
              </Link>
              {user && (
                <Link
                  href={`/${locale}/favorites`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                    isFavorites
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                  <span>{isEn ? "Favorites" : "Favorit"}</span>
                </Link>
              )}
            </div>
          </div>

          {user && (
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase block mb-1.5">
                {isEn ? "Contribute" : "Kontribusi"}
              </span>
              <div className="space-y-1">
                <Link
                  href={`/${locale}/skills/submit`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                    isSubmitSkill
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? "Submit Skill" : "Kirim Skill"}</span>
                </Link>
                <Link
                  href={`/${locale}/prompts/submit`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-medium ${
                    isSubmitPrompt
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{isEn ? "Submit Prompt" : "Kirim Prompt"}</span>
                </Link>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              {user && (user.role === "admin" || user.role === "editor") ? (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 text-foreground font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{tNav("admin")}</span>
                </Link>
              ) : (
                <div />
              )}

              {user && (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isEn ? "Sign Out" : "Keluar"}</span>
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