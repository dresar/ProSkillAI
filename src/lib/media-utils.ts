export function formatShortMediaName(name: string): string {
  if (!name) return "";
  const parts = name.split(".");
  const ext = parts.pop() || "png";
  const base = parts.join(".");
  if (base.includes("-")) {
    const afterDash = base.split("-").pop() || base;
    return `${afterDash.slice(0, 4)}.${ext}`;
  }
  return `${base.slice(0, 4)}.${ext}`;
}
