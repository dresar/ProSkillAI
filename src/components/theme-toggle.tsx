"use client";

import * as React from "react";
import { useTheme, COLOR_THEMES } from "./theme-provider";
import { Sun, Moon, Palette, Check, ChevronDown } from "lucide-react";

export function ThemeToggle({
  label = "Ganti tema",
  locale = "id",
}: {
  label?: string;
  locale?: string;
}) {
  const { resolvedTheme, setTheme, colorTheme, setColorTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const isDark = resolvedTheme === "dark";
  const activeDef = COLOR_THEMES.find((t) => t.id === colorTheme) || COLOR_THEMES[0];
  const isEn = locale === "en";

  const toggleMode = (e: React.MouseEvent<HTMLButtonElement>, targetMode?: "dark" | "light") => {
    const nextTheme = targetMode ?? (isDark ? "light" : "dark");

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
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 350,
          easing: "ease-in-out",
          pseudoElement: isDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={`${label} (${activeDef.name})`}
        title={`${label} (${activeDef.name})`}
        aria-haspopup="true"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 h-8 px-2 rounded-[6px] border border-border bg-surface hover:bg-muted text-foreground transition-all active:scale-95 cursor-pointer text-xs font-medium shrink-0"
      >
        <span
          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20 shadow-2xs flex items-center justify-center"
          style={{ backgroundColor: activeDef.accent }}
        />
        <Moon className="w-3.5 h-3.5 text-foreground shrink-0 hidden dark:block" aria-hidden="true" />
        <Sun className="w-3.5 h-3.5 text-foreground shrink-0 block dark:hidden" aria-hidden="true" />
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Theme selector"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-xl z-50 p-2.5 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-center justify-between gap-1 p-1 mb-2 rounded-lg bg-muted border border-border/60">
            <button
              type="button"
              onClick={(e) => toggleMode(e, "light")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                !isDark
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{isEn ? "Light" : "Terang"}</span>
            </button>
            <button
              type="button"
              onClick={(e) => toggleMode(e, "dark")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? "bg-surface text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{isEn ? "Dark" : "Gelap"}</span>
            </button>
          </div>

          <div className="px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Palette className="w-3 h-3" />
            <span>{isEn ? "Color Theme" : "Tema Warna"}</span>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-1.5">
            {COLOR_THEMES.map((item) => {
              const isSelected = item.id === colorTheme;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setColorTheme(item.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-foreground bg-muted font-semibold text-foreground shadow-2xs"
                      : "border-border/60 hover:border-foreground/40 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-md shrink-0 border border-black/10 dark:border-white/20 flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                  </span>
                  <span className="text-xs truncate flex-1">
                    {isEn ? item.name : item.nameId}
                  </span>
                  {isSelected && (
                    <Check className="w-3 h-3 text-foreground shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
