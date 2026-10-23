export const MAX_GALLERY_IMAGES = 5;
export const DEFAULT_SKILL_COVER = "/images/default-skill.png";

function isValidImageUrl(value: string): boolean {
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function getImageList(value: unknown, fallback?: string | null): string[] {
  const source = Array.isArray(value) ? value : [];
  const candidates = [...source, fallback].filter(
    (item): item is string => typeof item === "string"
  );
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of candidates) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed) || !isValidImageUrl(trimmed)) continue;
    seen.add(trimmed);
    result.push(trimmed);
    if (result.length >= MAX_GALLERY_IMAGES) break;
  }

  return result;
}

export function getCoverImage(
  value: unknown,
  fallback?: string | null,
  defaultCover: string | null = null
): string | null {
  return getImageList(value, fallback)[0] ?? defaultCover;
}

export function getSkillCoverImage(value: unknown, fallback?: string | null): string {
  return getCoverImage(value, fallback, DEFAULT_SKILL_COVER) ?? DEFAULT_SKILL_COVER;
}
