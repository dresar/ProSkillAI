"use server";

import { revalidatePath } from "next/cache";
import { readdir, stat, unlink } from "node:fs/promises";
import { join } from "node:path";
import { requireAdminOrEditor } from "@/lib/auth";
import { toGithubCdnUrl } from "@/lib/github-storage";

export interface MediaFileItem {
  id: string;
  name: string;
  url: string;
  cdnUrl: string;
  rawUrl: string;
  path: string;
  size: number;
  updatedAt: string;
  folder: string;
}

export async function getUploadedMediaList(): Promise<MediaFileItem[]> {
  await requireAdminOrEditor();

  const baseDir = join(process.cwd(), "public", "images", "uploads");
  const items: MediaFileItem[] = [];

  async function scanDir(currentDir: string, relativeFolder: string) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        const rel = relativeFolder ? `${relativeFolder}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          await scanDir(fullPath, rel);
        } else if (entry.isFile()) {
          const ext = entry.name.toLowerCase();
          if (
            ext.endsWith(".png") ||
            ext.endsWith(".jpg") ||
            ext.endsWith(".jpeg") ||
            ext.endsWith(".webp") ||
            ext.endsWith(".svg") ||
            ext.endsWith(".gif")
          ) {
            const stats = await stat(fullPath);
            const normalizedRel = rel.replace(/\\/g, "/");
            const urlPath = `/images/uploads/${normalizedRel}`;
            const { cdnUrl, rawUrl } = toGithubCdnUrl(urlPath);
            items.push({
              id: rel.replace(/[\\/]/g, "-"),
              name: entry.name,
              url: urlPath,
              cdnUrl,
              rawUrl,
              path: rel,
              size: stats.size,
              updatedAt: stats.mtime.toISOString(),
              folder: relativeFolder.split("/")[0] || "general",
            });
          }
        }
      }
    } catch {}
  }

  await scanDir(baseDir, "");
  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return items;
}

export async function deleteMediaAction(relativePath: string) {
  await requireAdminOrEditor();

  const safePath = relativePath.replace(/\.\./g, "").replace(/^\/+/, "");
  const fullPath = join(process.cwd(), "public", "images", "uploads", safePath);

  try {
    await unlink(fullPath);
  } catch {}

  revalidatePath("/admin/media");
  return { success: true };
}
