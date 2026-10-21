"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeSidebarToggle({ locale }: { locale: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: resolvedTheme === "dark" ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 350,
          easing: "ease-in-out",
          pseudoElement:
            resolvedTheme === "dark"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
        }
      );
    });
  };

  if (!mounted) {
    return (
      <div className="w-full h-8 rounded-lg border border-border/40 bg-muted/20" />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark
    ? locale === "en"
      ? "Light mode"
      : "Mode terang"
    : locale === "en"
    ? "Dark mode"
    : "Mode gelap";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-foreground/80 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-foreground/80 shrink-0" aria-hidden="true" />
      )}
      <span>{label}</span>
    </button>
  );
}
