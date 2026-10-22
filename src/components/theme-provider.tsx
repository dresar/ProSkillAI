"use client";

import * as React from "react";

export type Theme = "dark" | "light" | "system";

export type ColorTheme =
  | "noir"
  | "cyber"
  | "emerald"
  | "indigo"
  | "amber"
  | "rose"
  | "slate"
  | "aurora"
  | "neon"
  | "espresso";

export interface ColorThemeDefinition {
  id: ColorTheme;
  name: string;
  nameId: string;
  color: string;
  accent: string;
  border: string;
}

export const COLOR_THEMES: readonly ColorThemeDefinition[] = [
  { id: "noir", name: "Noir", nameId: "Noir", color: "#09090b", accent: "#f4f4f5", border: "#27272a" },
  { id: "cyber", name: "Cyber", nameId: "Cyber", color: "#04141c", accent: "#06b6d4", border: "#155e75" },
  { id: "emerald", name: "Emerald", nameId: "Zamrud", color: "#04180f", accent: "#10b981", border: "#065f46" },
  { id: "indigo", name: "Indigo", nameId: "Indigo", color: "#090a20", accent: "#6366f1", border: "#3730a3" },
  { id: "amber", name: "Amber", nameId: "Amber", color: "#150e05", accent: "#f59e0b", border: "#78350f" },
  { id: "rose", name: "Rose", nameId: "Mawar", color: "#190610", accent: "#f43f5e", border: "#881337" },
  { id: "slate", name: "Slate", nameId: "Slate", color: "#09121a", accent: "#38bdf8", border: "#0369a1" },
  { id: "aurora", name: "Aurora", nameId: "Aurora", color: "#041618", accent: "#14b8a6", border: "#115e59" },
  { id: "neon", name: "Neon", nameId: "Neon", color: "#16061c", accent: "#d946ef", border: "#701a75" },
  { id: "espresso", name: "Espresso", nameId: "Espresso", color: "#170e08", accent: "#d97706", border: "#7c2d12" },
] as const;

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  themes: string[];
  colorThemes: readonly ColorThemeDefinition[];
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  colorTheme: "noir",
  setColorTheme: () => {},
  themes: ["light", "dark", "system"],
  colorThemes: COLOR_THEMES,
});

export function useTheme() {
  return React.useContext(ThemeContext);
}

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "proskillai:theme-change";
const COLOR_STORAGE_KEY = "proskillai:color-theme";
const VALID_COLOR_THEMES = new Set<ColorTheme>([
  "noir",
  "cyber",
  "emerald",
  "indigo",
  "amber",
  "rose",
  "slate",
  "aurora",
  "neon",
  "espresso",
]);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

function getModeSnapshot(): Theme {
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY);
    if (val === "dark" || val === "light" || val === "system") {
      return val;
    }
  } catch {
    return "system";
  }
  return "system";
}

function getColorSnapshot(): ColorTheme {
  try {
    const val = localStorage.getItem(COLOR_STORAGE_KEY) as ColorTheme | null;
    if (val && VALID_COLOR_THEMES.has(val)) {
      return val;
    }
  } catch {
    return "noir";
  }
  return "noir";
}

function getServerModeSnapshot(): Theme {
  return "system";
}

function getServerColorSnapshot(): ColorTheme {
  return "noir";
}

function applyThemeToDocument(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  let isDark = false;
  if (theme === "dark") {
    isDark = true;
  } else if (theme === "light") {
    isDark = false;
  } else {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  if (isDark) {
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
  } else {
    root.classList.add("light");
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  storageKey = THEME_STORAGE_KEY,
  defaultColorTheme = "noir",
}: ThemeProviderProps) {
  const theme = React.useSyncExternalStore(subscribe, getModeSnapshot, getServerModeSnapshot);
  const colorTheme = React.useSyncExternalStore(subscribe, getColorSnapshot, getServerColorSnapshot);

  React.useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  React.useEffect(() => {
    const root = document.documentElement;
    const activeColor = colorTheme || defaultColorTheme;
    root.setAttribute("data-theme", activeColor);
  }, [colorTheme, defaultColorTheme]);

  const setTheme = React.useCallback(
    (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        void newTheme;
      }
      applyThemeToDocument(newTheme);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    },
    [storageKey]
  );

  const setColorTheme = React.useCallback((newColorTheme: ColorTheme) => {
    if (!VALID_COLOR_THEMES.has(newColorTheme)) return;
    try {
      localStorage.setItem(COLOR_STORAGE_KEY, newColorTheme);
      document.cookie = `proskillai_theme=${newColorTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      void newColorTheme;
    }
    const root = document.documentElement;
    root.setAttribute("data-theme", newColorTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const resolvedTheme: "dark" | "light" = React.useMemo(() => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }, [theme]);

  const value = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      colorTheme,
      setColorTheme,
      themes: ["light", "dark", "system"],
      colorThemes: COLOR_THEMES,
    }),
    [theme, resolvedTheme, setTheme, colorTheme, setColorTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
