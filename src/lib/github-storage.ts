import { randomBytes } from "node:crypto";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const MAX_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export interface UploadedImage {
  path: string;
  rawUrl: string;
  cdnUrl: string;
}

export function getStorageConfig() {
  const owner = process.env.GITHUB_STORAGE_OWNER;
  const repo = process.env.GITHUB_STORAGE_REPO;
  const branch = process.env.GITHUB_STORAGE_BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;
  return { owner, repo, branch, token, configured: Boolean(owner && repo && token) };
}

export function isStorageConfigured(): boolean {
  return getStorageConfig().configured;
}

export async function uploadImageToGitHub({
  file,
  folder,
  slug,
}: {
  file: File;
  folder: "skills" | "prompts";
  slug: string;
}): Promise<UploadedImage> {
  const { owner, repo, branch, token, configured } = getStorageConfig();

  if (!configured || !owner || !repo || !token) {
    throw new Error(
      "Konfigurasi GITHUB_STORAGE_OWNER, GITHUB_STORAGE_REPO, GITHUB_STORAGE_BRANCH, dan GITHUB_TOKEN belum lengkap."
    );
  }

  const extension = MIME_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Format gambar harus PNG, JPG, WEBP, atau GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }

  const safeFolder = folder === "prompts" ? "prompts" : "skills";
  const safeSlug =
    slug
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/(^-|-$)/g, "") || "misc";
  const fileName = `${Date.now()}-${randomBytes(4).toString("hex")}.${extension}`;
  const path = `assets/${safeFolder}/${safeSlug}/${fileName}`;
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
        message: `chore: upload ${safeFolder} image ${fileName}`,
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

  return {
    path,
    rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`,
    cdnUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`,
  };
}

export async function uploadImageToStorage({
  file,
  folder,
  slug,
}: {
  file: File;
  folder: "skills" | "prompts";
  slug: string;
}): Promise<UploadedImage> {
  const extension = MIME_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Format gambar harus PNG, JPG, WEBP, atau GIF.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ukuran setiap gambar maksimal 5 MB.");
  }

  if (isStorageConfigured()) {
    return uploadImageToGitHub({ file, folder, slug });
  }

  const safeFolder = folder === "prompts" ? "prompts" : "skills";
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

  const localUrl = `/images/uploads/${safeFolder}/${safeSlug}/${fileName}`;
  return {
    path: `assets/${safeFolder}/${safeSlug}/${fileName}`,
    rawUrl: localUrl,
    cdnUrl: localUrl,
  };
}
