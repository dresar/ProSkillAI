export function getTrendingPreviewUrl(fullName: string): string {
  if (!fullName || typeof fullName !== "string") {
    return "https://opengraph.githubassets.com/1/github/github";
  }

  const parts = fullName.split("/");
  if (parts.length !== 2) {
    return `https://opengraph.githubassets.com/1/${fullName}`;
  }

  const owner = parts[0].trim();
  const repo = parts[1].trim();

  const safeFileName = `${owner}--${repo}`.toLowerCase().replace(/[^a-z0-9_.-]/g, "-");
  return `/images/trending/${safeFileName}.png`;
}
