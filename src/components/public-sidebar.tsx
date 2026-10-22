"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { MessageSquare, Sparkles, ExternalLink, Shield, PanelLeftClose } from "lucide-react";
import { ThemeSidebarToggle } from "./theme-sidebar-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function PublicSidebar({ locale }: { locale: string }) {
  void PanelLeftClose;
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tBeta = useTranslations("beta");

  const isSkills = pathname.startsWith(`/${locale}/skills`);
  const isPrompts = pathname.startsWith(`/${locale}/prompts`);

  const learnItems = [
    { label: tBeta("teardowns"), key: "teardowns" },
    { label: tBeta("patterns"), key: "patterns" },
    { label: tBeta("guides"), key: "guides" },
    { label: tBeta("glossary"), key: "glossary" },
  ];

  const buildBetaItems = [
    { label: tBeta("tools"), key: "tools" },
    { label: tBeta("inspirations"), key: "inspirations" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 border-r border-border bg-background sticky top-0 h-screen overflow-y-auto p-4 select-none">
      <div className="space-y-6 flex-1">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors"
          aria-label="ProSkillAI Home"
        >
          <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 shadow-xs">
            <svg
              className="w-4 h-4 text-background"
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
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-foreground uppercase">
              PROSKILL AI
            </span>
            <span className="text-[10px] font-medium text-muted-foreground tracking-tight">
              Agent Skills & Prompts
            </span>
          </div>
        </Link>

        <div>
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 block mb-1.5">
            {locale === "en" ? "Learn" : "Pelajari"}
          </span>
          <nav className="space-y-0.5" aria-label="Learn navigation">
            {learnItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground/80 hover:text-foreground cursor-not-allowed select-none"
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground">
                  {locale === "en" ? "Beta" : "Beta"}
                </span>
              </div>
            ))}
          </nav>
        </div>

        <div>
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 block mb-1.5">
            {locale === "en" ? "Build" : "Bangun"}
          </span>
          <nav className="space-y-0.5" aria-label="Build navigation">
            <Link
              href={`/${locale}/skills`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isSkills
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span>{tNav("skills")}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSkills ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                Catalog
              </span>
            </Link>

            <Link
              href={`/${locale}/prompts`}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isPrompts
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <span>{tNav("prompts")}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isPrompts ? "bg-background/20 text-background" : "bg-muted text-muted-foreground"
                }`}
              >
                Library
              </span>
            </Link>

            <div className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground/80 hover:text-foreground cursor-not-allowed select-none">
              <span>Agent Kits</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400">
                New
              </span>
            </div>

            {buildBetaItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground/80 hover:text-foreground cursor-not-allowed select-none"
              >
                <span>{item.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/70 text-muted-foreground">
                  {locale === "en" ? "Beta" : "Beta"}
                </span>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-foreground/10 text-foreground flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">
                ProSkillAI Open
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {locale === "en" ? "Curated agent skills" : "Katalog skill terverifikasi"}
              </p>
            </div>
          </div>
        </div>

        <a
          href="https://github.com/dresar/ProSkillAI/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{locale === "en" ? "Feedback" : "Umpan Balik"}</span>
          </span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        <div className="space-y-1">
          <ThemeSidebarToggle locale={locale} />

          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground">
            <span>{locale === "en" ? "Language" : "Bahasa"}</span>
            <LanguageSwitcher currentLocale={locale} />
          </div>

          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground/70 hover:text-foreground rounded-lg transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{tNav("admin")}</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
