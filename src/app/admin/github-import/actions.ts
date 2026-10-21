"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { skills, importJobs, auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getAdminSkillById } from "@/db/queries";
import {
  parseGitHubUrl,
  fetchRepoInfo,
  findSkillFiles,
  fetchFileContent,
  parseSkillCandidate,
  type SkillCandidate,
} from "@/lib/github";
import { eq } from "drizzle-orm";

export async function scanGitHubRepoAction(repoInput: string) {
  await requireAdmin();

  try {
    const { owner, repo, branch, pathFilter } = parseGitHubUrl(repoInput);
    const repoInfo = await fetchRepoInfo(owner, repo);
    const targetBranch = branch || repoInfo.defaultBranch;
    const files = await findSkillFiles(owner, repo, targetBranch);

    const filteredFiles = pathFilter
      ? files.filter((f) => f.path.toLowerCase().includes(pathFilter.toLowerCase()))
      : files;

    if (filteredFiles.length === 0) {
      return {
        success: false as const,
        error: `Tidak ditemukan file SKILL.md pada branch '${targetBranch}'${pathFilter ? ` dengan filter '${pathFilter}'` : ""}.`,
      };
    }

    const candidates: SkillCandidate[] = [];
    const limit = Math.min(filteredFiles.length, 10);

    for (let i = 0; i < limit; i++) {
      const file = filteredFiles[i];
      try {
        const rawContent = await fetchFileContent(
          owner,
          repo,
          file.path,
          targetBranch
        );
        const parsed = parseSkillCandidate(
          file.path,
          file.sha,
          rawContent,
          repoInfo.licenseSpdx,
          repo
        );
        candidates.push(parsed);
      } catch {
        continue;
      }
    }

    return {
      success: true as const,
      repoInfo: {
        ...repoInfo,
        defaultBranch: targetBranch,
      },
      candidates,
    };
  } catch (err: unknown) {
    return {
      success: false as const,
      error: err instanceof Error ? err.message : "Gagal memindai repositori GitHub.",
    };
  }
}

export async function importCandidateAction(data: {
  repoInfo: {
    owner: string;
    repo: string;
    defaultBranch: string;
    licenseSpdx: string | null;
    htmlUrl: string;
  };
  candidate: SkillCandidate;
}) {
  const user = await requireAdmin();

  const { repoInfo, candidate } = data;
  const baseSlug = candidate.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${randomBytes(3).toString("hex")}`;

  const contentToStore = candidate.isPermissive
    ? candidate.rawContent
    : `> [!NOTE]\n> Skill ini diimpor dari repository [${repoInfo.owner}/${repoInfo.repo}](${repoInfo.htmlUrl}/blob/${repoInfo.defaultBranch}/${candidate.path}).\n> Lisensi repositori (${candidate.licenseSpdx || "Unspecified"}) membatasi redistribusi penuh. Silakan rujuk sumber asli.`;

  const newSkillId = randomBytes(16).toString("hex");

  await db.insert(skills).values({
    id: newSkillId,
    slug,
    titleId: candidate.name,
    titleEn: candidate.name,
    summaryId: candidate.description,
    summaryEn: candidate.description,
    contentId: contentToStore,
    contentEn: contentToStore,
    frontmatter: candidate.frontmatter,
    sourceType: "github",
    repoUrl: repoInfo.htmlUrl,
    filePath: candidate.path,
    branch: repoInfo.defaultBranch,
    commitHash: candidate.sha,
    license: candidate.licenseSpdx || "Proprietary / Unknown",
    authorName: repoInfo.owner,
    authorUrl: `https://github.com/${repoInfo.owner}`,
    attribution: `Diimpor dari GitHub: ${repoInfo.owner}/${repoInfo.repo} (${candidate.path})`,
    status: "draft",
    previewType: "none",
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.insert(importJobs).values({
    id: randomBytes(16).toString("hex"),
    repoUrl: repoInfo.htmlUrl,
    branch: repoInfo.defaultBranch,
    status: "completed",
    candidateCount: 1,
    importedCount: 1,
    createdBy: user.id,
    createdAt: new Date(),
  });

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "IMPORT_SKILL",
    entityType: "skill",
    entityId: newSkillId,
    details: {
      repo: `${repoInfo.owner}/${repoInfo.repo}`,
      path: candidate.path,
      license: candidate.licenseSpdx,
    },
    createdAt: new Date(),
  });

  revalidatePath("/admin/skills");
  revalidatePath("/id/skills");
  revalidatePath("/en/skills");

  return { success: true, skillId: newSkillId };
}

export async function resyncSkillAction(skillId: string) {
  const user = await requireAdmin();

  const skill = await getAdminSkillById(skillId);
  if (!skill || skill.sourceType !== "github" || !skill.repoUrl || !skill.filePath) {
    throw new Error("Skill bukan berasal dari GitHub atau data sumber tidak lengkap.");
  }

  const { owner, repo } = parseGitHubUrl(skill.repoUrl);
  const repoInfo = await fetchRepoInfo(owner, repo);
  const rawContent = await fetchFileContent(
    owner,
    repo,
    skill.filePath,
    skill.branch || repoInfo.defaultBranch
  );

  const candidate = parseSkillCandidate(
    skill.filePath,
    skill.commitHash || "",
    rawContent,
    repoInfo.licenseSpdx,
    repo
  );

  await db
    .update(skills)
    .set({
      summaryId: candidate.description,
      summaryEn: candidate.description,
      contentId: candidate.isPermissive ? rawContent : skill.contentId,
      contentEn: candidate.isPermissive ? rawContent : skill.contentEn,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, skillId));

  await db.insert(auditLog).values({
    id: randomBytes(16).toString("hex"),
    userId: user.id,
    userEmail: user.email,
    action: "RESYNC_SKILL",
    entityType: "skill",
    entityId: skillId,
    details: { repo: `${owner}/${repo}` },
    createdAt: new Date(),
  });

  revalidatePath(`/admin/skills/${skillId}/edit`);
  revalidatePath(`/id/skills/${skill.slug}`);
  revalidatePath(`/en/skills/${skill.slug}`);

  return { success: true };
}
