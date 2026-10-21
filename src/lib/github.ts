import matter from "gray-matter";

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  defaultBranch: string;
  licenseSpdx: string | null;
  licenseName: string | null;
  htmlUrl: string;
  description: string | null;
}

export interface SkillCandidate {
  path: string;
  sha: string;
  name: string;
  description: string;
  rawContent: string;
  isPermissive: boolean;
  licenseSpdx: string | null;
  frontmatter: Record<string, unknown>;
}

export interface ParsedGitHubInput {
  owner: string;
  repo: string;
  branch?: string;
  pathFilter?: string;
}

const PERMISSIVE_LICENSES = new Set([
  "mit",
  "apache-2.0",
  "bsd-2-clause",
  "bsd-3-clause",
  "isc",
  "unlicense",
  "cc0-1.0",
  "cc-by-4.0",
  "0bsd",
]);

export function parseGitHubUrl(input: string): ParsedGitHubInput {
  const cleaned = input.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\.git$/i, "");
  const parts = cleaned.split("/").filter(Boolean);

  if (parts.length < 2) {
    throw new Error("Format URL GitHub tidak valid. Harap gunakan format owner/repo atau https://github.com/owner/repo");
  }

  const owner = parts[0];
  const repo = parts[1];

  if (parts.length === 2) {
    return { owner, repo };
  }

  if ((parts[2] === "tree" || parts[2] === "blob") && parts.length >= 4) {
    const branch = parts[3];
    const pathFilter = parts.slice(4).join("/");
    return { owner, repo, branch, pathFilter: pathFilter || undefined };
  }

  const pathFilter = parts.slice(2).join("/");
  return { owner, repo, pathFilter };
}

function getGitHubHeaders(etag?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ProSkillAI-Importer",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (etag) {
    headers["If-None-Match"] = etag;
  }
  return headers;
}

export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepoInfo> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: getGitHubHeaders(),
    next: { revalidate: 0 },
  });

  if (res.status === 404) {
    throw new Error(`Repository ${owner}/${repo} tidak ditemukan atau bersifat privat.`);
  }

  if (res.status === 403) {
    const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
    if (rateLimitRemaining === "0") {
      const resetTime = res.headers.get("x-ratelimit-reset");
      const date = resetTime ? new Date(Number(resetTime) * 1000).toLocaleTimeString() : "nanti";
      throw new Error(`Batas kuota GitHub API tercapai. Kuota diatur ulang pada pukul ${date}.`);
    }
    throw new Error("Akses GitHub API ditolak.");
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    owner: data.owner?.login || owner,
    repo: data.name || repo,
    defaultBranch: data.default_branch || "main",
    licenseSpdx: data.license?.spdx_id || null,
    licenseName: data.license?.name || null,
    htmlUrl: data.html_url,
    description: data.description,
  };
}

export async function findSkillFiles(
  owner: string,
  repo: string,
  branch: string
): Promise<{ path: string; sha: string }[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: getGitHubHeaders(),
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal mengambil struktur pohon repositori: ${res.statusText}`);
  }

  const data = (await res.json()) as {
    tree?: Array<{
      type: string;
      path: string;
      sha: string;
    }>;
  };

  return (data.tree || [])
    .filter(
      (item) =>
        item.type === "blob" &&
        /(?:^|\/)SKILL\.md$/i.test(item.path)
    )
    .map((item) => ({
      path: item.path,
      sha: item.sha,
    }));
}

export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string
): Promise<string> {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(ref)}/${encodedPath}`,
    {
      headers: process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {},
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    throw new Error(`Gagal mengunduh file ${path}`);
  }

  return await res.text();
}

export function parseSkillCandidate(
  path: string,
  sha: string,
  content: string,
  licenseSpdx: string | null,
  fallbackRepoName?: string
): SkillCandidate {
  const parsed = matter(content);

  const frontmatterLicense =
    typeof parsed.data.license === "string" ? parsed.data.license.trim() : null;
  const effectiveLicense = licenseSpdx || frontmatterLicense;
  const isPermissive = effectiveLicense
    ? PERMISSIVE_LICENSES.has(effectiveLicense.toLowerCase())
    : false;

  const folderName = path.replace(/(?:^|\/)SKILL\.md$/i, "").split("/").filter(Boolean).pop();
  const name =
    (typeof parsed.data.name === "string" && parsed.data.name.trim()) ||
    folderName ||
    fallbackRepoName ||
    "Skill";

  const description =
    (typeof parsed.data.description === "string" && parsed.data.description.trim()) ||
    (typeof parsed.data.summary === "string" && parsed.data.summary.trim()) ||
    "Instruksi skill AI agent yang diimpor dari GitHub.";

  return {
    path,
    sha,
    name,
    description,
    rawContent: content,
    isPermissive,
    licenseSpdx: effectiveLicense,
    frontmatter: parsed.data,
  };
}
