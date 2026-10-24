import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { uploadImageToStorage } from "@/lib/github-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILES = 5;

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
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "Maksimal 5 gambar per upload." }, { status: 400 });
  }

  const rawFolder = String(formData.get("folder") || "general");
  const folder = ["skills", "prompts", "ui", "general"].includes(rawFolder) ? rawFolder : "general";
  const slug = String(formData.get("slug") || "gallery");

  try {
    const images: Array<{ url: string; cdnUrl: string; rawUrl: string; path: string }> = [];
    for (const file of files) {
      const uploaded = await uploadImageToStorage({ file, folder, slug });
      images.push({
        url: uploaded.cdnUrl,
        cdnUrl: uploaded.cdnUrl,
        rawUrl: uploaded.rawUrl,
        path: uploaded.path,
      });
    }
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal." },
      { status: 400 }
    );
  }
}
