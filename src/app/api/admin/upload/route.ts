import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isStorageConfigured, uploadImageToGitHub } from "@/lib/github-storage";

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
  if (!isStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Konfigurasi GITHUB_STORAGE_OWNER, GITHUB_STORAGE_REPO, GITHUB_STORAGE_BRANCH, dan GITHUB_TOKEN belum lengkap.",
      },
      { status: 500 }
    );
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

  const folder = formData.get("folder") === "prompts" ? "prompts" : "skills";
  const slug = String(formData.get("slug") || "misc");

  try {
    const images: Array<{ url: string; path: string }> = [];
    for (const file of files) {
      const uploaded = await uploadImageToGitHub({ file, folder, slug });
      images.push({ url: uploaded.cdnUrl, path: uploaded.path });
    }
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload gagal." },
      { status: 400 }
    );
  }
}
