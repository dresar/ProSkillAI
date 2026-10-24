import { randomBytes } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export interface UploadedImage {
  path: string;
  rawUrl: string;
  cdnUrl: string;
}

export function getStorageConfig() {
  const owner = process.env.GITHUB_STORAGE_OWNER || process.env.GITHUB_OWNER || "dresar";
  const repo = process.env.GITHUB_STORAGE_REPO || process.env.GITHUB_REPO || "ProSkillAI";
  const branch = process.env.GITHUB_STORAGE_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;
  return { owner, repo, branch, token, configured: Boolean(owner && repo && token) };
}

export function isStorageConfigured(): boolean {
  return getStorageConfig().configured;
}

export function toGithubCdnUrl(pathOrUrl: string): { cdnUrl: string; rawUrl: string; localUrl: string } {
  const { owner, repo, branch } = getStorageConfig();
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

export async function uploadImageToGitHub({
  file,
  folder,
  slug,
}: {
  file: File;
  folder: "skills" | "prompts" | "ui" | "general" | string;
  slug: string;
}): Promise<UploadedImage> {
  const { owner, repo, branch, token, configured } = getStorageConfig();

  if (!configured || !owner || !repo || !token) {
    throw new Error(
      "Konfigurasi GITHUB_STORAGE_OWNER, GITHUB_STORAGE_REPO, GITHUB_STORAGE_BRANCH, dan GITHUB_TOKEN belum lengkap."
    );
  }

  const extension = MIME_EXTENSIONS[file.type] || "png";
  if (!MIME_EXTENSIONS[file.type]) {
    throw new Error("Format gambar harus PNG, JPG, WEBP, GIF, atau SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }

  const safeFolder = ["prompts", "skills", "ui", "general"].includes(folder) ? folder : "general";
  const safeSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "") || "misc";
  const fileName = `${Date.now()}-${randomBytes(4).toString("hex")}.${extension}`;
  const path = `public/images/uploads/${safeFolder}/${safeSlug}/${fileName}`;
  const content = Buffer.from(await file.arrayBuffer()).toString("base64");
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "ProSkillAI-Admin",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `chore: upload ${safeFolder} asset ${fileName}`,
        content,
        branch,
      }),
    }
  );

  if (!response.ok) {
    let detail = "";
    try {
      const data = (await response.json()) as { message?: string };
      detail = data.message || "";
    } catch {
      detail = "";
    }

    if (response.status === 401) {
      throw new Error("Token GitHub tidak valid atau tidak memiliki izin Contents: write.");
    }
    if (response.status === 403) {
      throw new Error(`Akses upload ke GitHub ditolak. ${detail}`.trim());
    }
    if (response.status === 404) {
      throw new Error("Repo atau branch CDN tidak ditemukan. Periksa konfigurasi GITHUB_STORAGE_*.");
    }
    throw new Error(`Upload ke GitHub gagal (${response.status}). ${detail}`.trim());
  }

  const localRelative = `images/uploads/${safeFolder}/${safeSlug}/${fileName}`;
  const { cdnUrl, rawUrl, localUrl } = toGithubCdnUrl(localRelative);

  return {
    path: localUrl,
    rawUrl,
    cdnUrl,
  };
}

export async function uploadImageToStorage({
  file,
  folder,
  slug,
}: {
  file: File;
  folder: "skills" | "prompts" | "ui" | "general" | string;
  slug: string;
}): Promise<UploadedImage> {
  const extension = MIME_EXTENSIONS[file.type] || "png";
  if (!MIME_EXTENSIONS[file.type]) {
    throw new Error("Format gambar harus PNG, JPG, WEBP, GIF, atau SVG.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }

  const safeFolder = ["prompts", "skills", "ui", "general"].includes(folder) ? folder : "general";
  const safeSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "") || "misc";
  const fileName = `${Date.now()}-${randomBytes(4).toString("hex")}.${extension}`;

  const uploadDir = join(process.cwd(), "public", "images", "uploads", safeFolder, safeSlug);
  await mkdir(uploadDir, { recursive: true });
  const filePath = join(uploadDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const localRelative = `images/uploads/${safeFolder}/${safeSlug}/${fileName}`;
  const { cdnUrl, rawUrl, localUrl } = toGithubCdnUrl(localRelative);

  const { configured, owner, repo, branch, token } = getStorageConfig();
  if (configured && token) {
    try {
      const gitPath = `public/${localRelative}`;
      const content = buffer.toString("base64");
      const encodedPath = gitPath.split("/").map(encodeURIComponent).join("/");
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "ProSkillAI-Admin",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `chore: upload ${safeFolder} asset ${fileName}`,
            content,
            branch,
          }),
        }
      );
    } catch {}
  }

  return {
    path: localUrl,
    rawUrl,
    cdnUrl,
  };
}
