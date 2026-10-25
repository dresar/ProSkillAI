export const MAX_GALLERY_IMAGES = 5;
export const DEFAULT_SKILL_COVER = "/images/default-skill.png";
export const DEFAULT_PROMPT_COVER = "/images/default-skill.png";
export const DEFAULT_MCP_COVER = "/images/default-skill.png";

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

export function getPromptCoverImage(value: unknown, fallback?: string | null): string {
  return getCoverImage(value, fallback, DEFAULT_PROMPT_COVER) ?? DEFAULT_PROMPT_COVER;
}

export function getMcpCoverImage(value?: unknown, fallback?: string | null): string {
  return getCoverImage(value, fallback, DEFAULT_MCP_COVER) ?? DEFAULT_MCP_COVER;
}

export function getSkillAuthorAvatar(skill: {
  authorName?: string | null;
  authorUrl?: string | null;
  repoUrl?: string | null;
  previewImageUrl?: string | null;
  images?: unknown;
}): string {
  if (skill.previewImageUrl && !skill.previewImageUrl.includes("default-skill.png")) {
    return skill.previewImageUrl;
  }

  if (Array.isArray(skill.images) && skill.images.length > 0 && typeof skill.images[0] === "string" && !skill.images[0].includes("default-skill.png")) {
    return skill.images[0];
  }

  if (skill.repoUrl) {
    const match = skill.repoUrl.match(/github\.com\/([^/]+)/i);
    if (match && match[1] && !["login", "signup", "settings"].includes(match[1].toLowerCase())) {
      return `https://github.com/${match[1]}.png`;
    }
  }

  if (skill.authorUrl) {
    const match = skill.authorUrl.match(/github\.com\/([^/]+)/i);
    if (match && match[1]) {
      return `https://github.com/${match[1]}.png`;
    }
  }

  if (skill.authorName) {
    const clean = skill.authorName.replace(/^@/, "").trim().split(/\s+/)[0];
    if (clean && clean.toLowerCase() !== "proskillai") {
      return `https://github.com/${clean}.png`;
    }
  }

  return "https://github.com/dresar.png";
}
