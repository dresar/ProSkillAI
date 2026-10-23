"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Bot,
  FileCode,
  Layers,
  LogIn,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { FeedbackModal } from "./feedback-modal";
import { BrandLogo } from "./brand-logo";
import { type PublicUser } from "./public-user-nav";
import { usePublicSidebar } from "./public-sidebar-context";
import { logoutAction } from "@/app/login/actions";
import { getFavorites, onFavoritesChange } from "@/lib/favorites";

export function PublicSidebar({
  locale,
  user,
}: {
  locale: string;
  user?: PublicUser | null;
}) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const { collapsed, toggleSidebar } = usePublicSidebar();

  const [favCount, setFavCount] = React.useState(0);

  React.useEffect(() => {
    setFavCount(getFavorites().length);
    const unsub = onFavoritesChange(() => {
      setFavCount(getFavorites().length);
    });
    return unsub;
  }, []);

  const isEn = locale === "en";
  const isSkills = pathname.startsWith(`/${locale}/skills`);
  const isPrompts = pathname.startsWith(`/${locale}/prompts`);
  const isFavorites = pathname.startsWith(`/${locale}/favorites`);
  const isSubmitSkill = pathname.startsWith(`/${locale}/skills/submit`);
  const isSubmitPrompt = pathname.startsWith(`/${locale}/prompts/submit`);

  const submitSkillHref = user
    ? `/${locale}/skills/submit`
    : `/login?redirect=/${locale}/skills/submit`;

  const submitPromptHref = user
    ? `/${locale}/prompts/submit`
    : `/login?redirect=/${locale}/prompts/submit`;

  const exploreItems = [
    {
      href: `/${locale}/skills`,
      label: tNav("skills"),
      icon: Layers,
      active: isSkills && !isSubmitSkill,
    },
    {
      href: `/${locale}/prompts`,
      label: tNav("prompts"),
      icon: FileCode,
      active: isPrompts && !isSubmitPrompt,
    },
    ...(user
      ? [
          {
            href: `/${locale}/favorites`,
            label: isEn ? "Favorites" : "Favorit",
            icon: Star,
            active: isFavorites,
            count: favCount,
          },
        ]
      : []),
  ];

  const contributeItems = [
    {
      href: submitSkillHref,
      label: isEn ? "Submit Skill" : "Kirim Skill",
      icon: Plus,
      active: isSubmitSkill,
    },
    {
      href: submitPromptHref,
      label: isEn ? "Submit Prompt" : "Kirim Prompt",
      icon: Sparkles,
      active: isSubmitPrompt,
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 border-r border-border bg-background sticky top-0 h-screen overflow-y-auto select-none transition-all duration-200 ${
        collapsed ? "w-16 p-2" : "w-60 xl:w-64 p-4"
      }`}
    >
      <div className="space-y-6 flex-1">
        <div
          className={`flex ${collapsed ? "flex-col gap-2" : "items-center justify-between gap-2"} px-1 py-1`}
        >
          <Link
            href={`/${locale}`}
            className={`flex items-center rounded-lg hover:bg-muted/40 transition-colors ${
              collapsed ? "justify-center w-full" : "gap-3"
            }`}
            aria-label="ProSkillAI Home"
            title={collapsed ? "ProSkillAI Home" : undefined}
          >
            <BrandLogo className="w-8 h-8" size={32} />
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                  PROSKILL AI
                </span>
                <span className="text-[10px] font-medium text-muted-foreground tracking-tight truncate">
                  Agent Skills &amp; Prompts
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleSidebar}
            className={`inline-flex items-center justify-center w-7 h-7 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer ${
              collapsed ? "" : "shrink-0"
            }`}
            aria-label={collapsed ? (isEn ? "Expand sidebar" : "Perlebar sidebar") : (isEn ? "Collapse sidebar" : "Ciutkan sidebar")}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-3.5 h-3.5" />
            ) : (
              <PanelLeftClose className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 block mb-1.5">
                {isEn ? "Explore" : "Jelajah"}
              </span>
            )}
            <nav className="space-y-0.5" aria-label="Explore navigation">
              {exploreItems.map((item) => {
                const Icon = item.icon;
                const hasCount = typeof item.count === "number" && item.count > 0;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center py-2 rounded-lg text-xs font-medium transition-colors ${
                      collapsed ? "justify-center px-0" : "justify-between px-3"
                    } ${
                      item.active
                        ? "bg-foreground text-background font-semibold shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span
                      className={`flex items-center min-w-0 ${collapsed ? "" : "gap-2"}`}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${item.href.includes("favorites") && hasCount ? "text-amber-500 fill-amber-400" : ""}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </span>
                    {!collapsed && hasCount && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.active
                            ? "bg-background/20 text-background"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {user && (
            <div>
              {!collapsed && (
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase px-3 block mb-1.5">
                  {isEn ? "Contribute" : "Kontribusi"}
                </span>
              )}
              <nav className="space-y-0.5" aria-label="Contribute navigation">
                {contributeItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center py-2 rounded-lg text-xs font-medium transition-colors ${
                        collapsed ? "justify-center px-0" : "justify-between px-3"
                      } ${
                        item.active
                          ? "bg-foreground text-background font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span
                        className={`flex items-center min-w-0 ${collapsed ? "" : "gap-2"}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        {!collapsed && (
          <div className="p-3 rounded-lg border border-border/60 bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-foreground/10 text-foreground flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5 text-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground truncate">
                  {isEn ? "AI Skill Assistant" : "Asisten AI Cerdas"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {isEn ? "5 Free credits for users" : "5 Kredit tanya skill gratis"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            collapsed
              ? "[&>button]:justify-center [&>button]:px-0 [&>button>span>span]:hidden [&>button>span:last-child]:hidden"
              : ""
          }
        >
          <FeedbackModal locale={locale} user={user} />
        </div>

        <div className="pt-2 border-t border-border">
          {user ? (
            collapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-[6px] bg-foreground text-background font-mono text-[10px] font-bold flex items-center justify-center shrink-0"
                  title={`${user.name} · ${user.email} (${user.role})`}
                >
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                {(user.role === "admin" || user.role === "editor") && (
                  <Link
                    href="/admin"
                    title={tNav("admin")}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] bg-foreground/10 text-foreground hover:bg-muted transition-all active:scale-95"
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </Link>
                )}
                <form action={logoutAction} className="flex justify-center">
                  <button
                    type="submit"
                    title={isEn ? "Sign Out" : "Keluar"}
                    aria-label={isEn ? "Sign Out" : "Keluar"}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-[6px] border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg border border-border bg-surface/90 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-[5px] bg-foreground text-background font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-muted text-foreground border border-border">
                    {user.role}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 border-t border-border">
                  {user.role === "admin" || user.role === "editor" ? (
                    <Link
                      href="/admin"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-7 px-2 rounded-[5px] bg-foreground text-background text-[11px] font-medium hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Shield className="w-3 h-3" />
                      <span>{tNav("admin")}</span>
                    </Link>
                  ) : (
                    <div className="flex-1 text-[11px] font-mono text-muted-foreground truncate">
                      {typeof user.aiCredits === "number" ? `${user.aiCredits}/5 kredit AI` : "Member"}
                    </div>
                  )}
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-[5px] border border-border text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                      title={isEn ? "Sign Out" : "Keluar"}
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </form>
                </div>
              </div>
            )
          ) : collapsed ? (
            <Link
              href="/login"
              title={isEn ? "Sign In" : "Masuk"}
              className="w-full flex items-center justify-center h-8 rounded-[6px] bg-foreground text-background hover:opacity-90 transition-all active:scale-95 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-foreground text-background hover:opacity-90 rounded-[6px] transition-all active:scale-95 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isEn ? "Sign In" : "Masuk ke Akun"}</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}