export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return count.toString();
}

const idNumberFormatter = new Intl.NumberFormat("id-ID");

export function formatIdNumber(value: number): string {
  return idNumberFormatter.format(value);
}

export function formatIsoDate(value?: string | Date | null): string | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function getCategoryColor(slugOrName?: string | null): string {
  if (!slugOrName) return "text-zinc-400";
  const s = slugOrName.toLowerCase();

  if (s.includes("ux") || s.includes("interface")) {
    return "text-sky-400";
  }
  if (s.includes("system") || s.includes("design system") || s.includes("tailwind")) {
    return "text-cyan-400";
  }
  if (s.includes("motion") || s.includes("visual") || s.includes("ppt")) {
    return "text-purple-400";
  }
  if (s.includes("access") || s.includes("wcag") || s.includes("a11y")) {
    return "text-pink-400";
  }
  if (s.includes("product") || s.includes("research")) {
    return "text-indigo-400";
  }
  if (s.includes("content") || s.includes("comm") || s.includes("writing")) {
    return "text-amber-400";
  }
  if (s.includes("market") || s.includes("copy") || s.includes("growth")) {
    return "text-emerald-400";
  }
  if (s.includes("arch") || s.includes("infra") || s.includes("database")) {
    return "text-violet-400";
  }
  if (s.includes("code") || s.includes("auto") || s.includes("dev")) {
    return "text-blue-400";
  }

  return "text-sky-400";
}

export function getAuthorInitials(name?: string | null): string {
  if (!name) return "AI";
  const parts = name.trim().split(/[\s_-]+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
