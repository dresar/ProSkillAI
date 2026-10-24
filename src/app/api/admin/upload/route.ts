import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadImageToStorage } from "@/lib/github-storage";
import { db } from "@/db";
import { media } from "@/db/schema";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "editor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Body upload tidak valid." }, { status: 400 });
  }

  const files = formData.getAll("files").filter((item): item is File => item instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Tidak ada file yang diunggah." }, { status: 400 });
  }

  const rawFolder = String(formData.get("folder") || "general");
  const folder = ["skills", "prompts", "ui", "general"].includes(rawFolder) ? rawFolder : "general";
  const slug = String(formData.get("slug") || "gallery");

  try {
    const images: Array<{
      id: string;
      name: string;
      url: string;
      cdnUrl: string;
      rawUrl: string;
      path: string;
      size: number;
      folder: string;
    }> = [];

    for (const file of files) {
      const uploaded = await uploadImageToStorage({ file, folder, slug });
      const mediaId = `media-${Date.now()}-${randomBytes(3).toString("hex")}`;
      const safePath = uploaded.path.replace(/^\/+/, "").replace(/^public\//, "");

      try {
        await db.insert(media).values({
          id: mediaId,
          name: uploaded.fileName,
          url: uploaded.path,
          cdnUrl: uploaded.cdnUrl,
          rawUrl: uploaded.rawUrl,
          path: safePath,
          folder: uploaded.folder,
          size: uploaded.size,
          mimeType: uploaded.mimeType,
          uploadedBy: user.id,
        });
      } catch {}

      images.push({
        id: mediaId,
        name: uploaded.fileName,
        url: uploaded.cdnUrl,
        cdnUrl: uploaded.cdnUrl,
        rawUrl: uploaded.rawUrl,
        path: safePath,
        size: uploaded.size,
        folder: uploaded.folder,
      });
    }

    return NextResponse.json({ images, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal." },
      { status: 400 }
    );
  }
}
