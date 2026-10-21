import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { GitHubImportClient } from "./import-client";

export default async function GitHubImportPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Impor Skill dari GitHub
        </h2>
        <p className="text-xs text-neutral-500">
          Ambil otomatis file SKILL.md dari repository publik menggunakan Git Trees API dengan verifikasi lisensi SPDX.
        </p>
      </div>

      <GitHubImportClient />
    </div>
  );
}
