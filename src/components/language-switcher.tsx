"use client";

import { usePathname } from "@/i18n/routing";
import Link from "next/link";

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const nextLocale = currentLocale === "id" ? "en" : "id";
  const targetHref = `/${nextLocale}${pathname === "/" ? "" : pathname}`;

  return (
    <Link
      href={targetHref}
      hrefLang={nextLocale}
      className="inline-flex items-center justify-center h-8 px-2.5 text-xs font-medium rounded border border-neutral-300 dark:border-neutral-800 bg-surface hover:bg-surface-hover text-foreground transition-transform active:scale-95"
      aria-label={`Ganti bahasa ke ${nextLocale === "en" ? "English" : "Bahasa Indonesia"}`}
    >
      {currentLocale === "id" ? "EN" : "ID"}
    </Link>
  );
}
