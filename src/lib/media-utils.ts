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

export function toGithubCdnUrl(
  pathOrUrl: string,
  config?: { owner?: string; repo?: string; branch?: string }
): { cdnUrl: string; rawUrl: string; localUrl: string } {
  const owner = config?.owner || process.env.GITHUB_STORAGE_OWNER || process.env.GITHUB_OWNER || "dresar";
  const repo = config?.repo || process.env.GITHUB_STORAGE_REPO || process.env.GITHUB_REPO || "ProSkillAI";
  const branch = config?.branch || process.env.GITHUB_STORAGE_BRANCH || "main";
  const clean = (pathOrUrl || "").trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    if (clean.includes("githubusercontent.com") || clean.includes("jsdelivr.net")) {
      return { cdnUrl: clean, rawUrl: clean, localUrl: clean };
    }
  }

  const cleanPath = clean.replace(/^\/+/, "").replace(/^public\//, "");
  const localUrl = `/${cleanPath}`;
  const cdnUrl = `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/public/${cleanPath}`;
  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/${cleanPath}`;
  return { cdnUrl, rawUrl, localUrl };
}
