"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle({ label = "Ganti tema" }: { label?: string }) {
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
      <div className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-800" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`${label} (${isDark ? "Gelap" : "Terang"})`}
      title={`${label} (${isDark ? "Gelap" : "Terang"})`}
      className="inline-flex items-center justify-center w-8 h-8 rounded border border-neutral-300 dark:border-neutral-800 bg-surface hover:bg-surface-hover text-foreground transition-transform active:scale-95 cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-foreground" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-foreground" aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
