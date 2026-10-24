"use server";

import { revalidatePath } from "next/cache";
import { eq, or, desc } from "drizzle-orm";
import { requireAdminOrEditor } from "@/lib/auth";
import { db } from "@/db";
import { media, type Media } from "@/db/schema";
import { toGithubCdnUrl } from "@/lib/media-utils";

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

  const { join } = await import("node:path");
  const { readdir, stat } = await import("node:fs/promises");

  const baseDir = join(process.cwd(), "public", "images", "uploads");
  const diskFiles: Array<{ name: string; fullPath: string; rel: string; folder: string; size: number; mtime: string }> = [];

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
            diskFiles.push({
              name: entry.name,
              fullPath,
              rel: rel.replace(/\\/g, "/"),
              folder: relativeFolder.split("/")[0] || "general",
              size: stats.size,
              mtime: stats.mtime.toISOString(),
            });
          }
        }
      }
    } catch {}
  }

  await scanDir(baseDir, "");

  let dbMedia: Media[] = [];
  try {
    dbMedia = await db.select().from(media).orderBy(desc(media.createdAt));
  } catch {}

  const dbPaths = new Set(dbMedia.map((m) => m.path));
  for (const disk of diskFiles) {
    if (!dbPaths.has(disk.rel)) {
      const urlPath = `/images/uploads/${disk.rel}`;
      const { cdnUrl, rawUrl } = toGithubCdnUrl(urlPath);
      const newId = `media-${disk.rel.replace(/[\/\\]/g, "-")}`;
      try {
        await db.insert(media).values({
          id: newId,
          name: disk.name,
          url: urlPath,
          cdnUrl,
          rawUrl,
          path: disk.rel,
          folder: disk.folder,
          size: disk.size,
          mimeType: `image/${disk.name.split(".").pop() || "png"}`,
        });
        dbMedia.push({
          id: newId,
          name: disk.name,
          url: urlPath,
          cdnUrl,
          rawUrl,
          path: disk.rel,
          folder: disk.folder,
          size: disk.size,
          mimeType: `image/${disk.name.split(".").pop() || "png"}`,
          uploadedBy: null,
          createdAt: new Date(disk.mtime),
          updatedAt: new Date(disk.mtime),
        });
      } catch {}
    }
  }

  const items: MediaFileItem[] = dbMedia.map((m) => {
    const { cdnUrl, rawUrl } = toGithubCdnUrl(m.url);
    return {
      id: m.id,
      name: m.name,
      url: m.url,
      cdnUrl: m.cdnUrl || cdnUrl,
      rawUrl: m.rawUrl || rawUrl,
      path: m.path,
      size: m.size,
      updatedAt: m.createdAt.toISOString(),
      folder: m.folder,
    };
  });

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return items;
}

export async function deleteMediaAction(identifier: string) {
  await requireAdminOrEditor();

  const { join } = await import("node:path");
  const { unlink } = await import("node:fs/promises");
  const { existsSync } = await import("node:fs");
  const { deleteImageFromGitHub } = await import("@/lib/github-storage");

  const safeIdent = identifier.replace(/\.\./g, "").replace(/^\/+/, "");
  let targetPath = safeIdent;

  try {
    const found = await db
      .select()
      .from(media)
      .where(or(eq(media.id, identifier), eq(media.path, safeIdent), eq(media.url, `/${safeIdent}`)))
      .limit(1);

    if (found[0]) {
      targetPath = found[0].path;
      await db.delete(media).where(eq(media.id, found[0].id));
    }
  } catch {}

  const fullPath = join(process.cwd(), "public", "images", "uploads", targetPath);
  try {
    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }
  } catch {}

  const gitRelativePath = `images/uploads/${targetPath}`;
  void deleteImageFromGitHub(gitRelativePath);

  revalidatePath("/admin/media");
  return { success: true };
}

export async function cleanOrphanedMediaAction() {
  await requireAdminOrEditor();

  const { join } = await import("node:path");
  const { readdir, unlink } = await import("node:fs/promises");
  const { existsSync } = await import("node:fs");
  const { deleteImageFromGitHub } = await import("@/lib/github-storage");

  const baseDir = join(process.cwd(), "public", "images", "uploads");
  const diskFiles: string[] = [];

  async function scan(currentDir: string, rel: string) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(currentDir, entry.name);
        const subRel = rel ? `${rel}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          await scan(full, subRel);
        } else if (entry.isFile()) {
          diskFiles.push(subRel.replace(/\\/g, "/"));
        }
      }
    } catch {}
  }

  await scan(baseDir, "");

  let dbMedia: Media[] = [];
  try {
    dbMedia = await db.select().from(media);
  } catch {}

  const dbPaths = new Set(dbMedia.map((m) => m.path));
  let deletedFiles = 0;
  let deletedRecords = 0;

  for (const diskRel of diskFiles) {
    if (!dbPaths.has(diskRel)) {
      const full = join(baseDir, diskRel);
      try {
        await unlink(full);
        deletedFiles++;
        void deleteImageFromGitHub(`images/uploads/${diskRel}`);
      } catch {}
    }
  }

  for (const record of dbMedia) {
    const full = join(baseDir, record.path);
    if (!existsSync(full)) {
      try {
        await db.delete(media).where(eq(media.id, record.id));
        deletedRecords++;
      } catch {}
    }
  }

  revalidatePath("/admin/media");
  return { success: true, deletedFiles, deletedRecords };
}
