"use server";

import { requireAdmin } from "@/lib/auth";
import {
  fetchFileContent,
  fetchRepoInfo,
  findSkillFiles,
  parseGitHubUrl,
  parseSkillCandidate,
} from "@/lib/github";

export interface GitHubFormCandidate {
  path: string;
  sha: string;
  name: string;
  description: string;
  content: string;
  isPermissive: boolean;
  licenseSpdx: string | null;
}

export interface GitHubFormRepo {
  owner: string;
  repo: string;
  defaultBranch: string;
  licenseSpdx: string | null;
  htmlUrl: string;
  description: string | null;
}

export async function scanGitHubForFormAction(repoInput: string): Promise<{
  error?: string;
  repo?: GitHubFormRepo;
  candidates?: GitHubFormCandidate[];
}> {
  try {
    await requireAdmin();
  } catch {
    return { error: "Akses ditolak. Hanya admin yang dapat memindai repositori." };
  }

  try {
    const parsed = parseGitHubUrl(repoInput);
    const repoInfo = await fetchRepoInfo(parsed.owner, parsed.repo);
    const branch = parsed.branch || repoInfo.defaultBranch;
    const files = await findSkillFiles(parsed.owner, parsed.repo, branch);

    const filtered = parsed.pathFilter
      ? files.filter((file) => file.path.startsWith(parsed.pathFilter!))
      : files;

    const repo: GitHubFormRepo = {
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      defaultBranch: branch,
      licenseSpdx: repoInfo.licenseSpdx,
      htmlUrl: repoInfo.htmlUrl,
      description: repoInfo.description,
    };

    if (filtered.length === 0) {
      return { repo, candidates: [], error: "Tidak ada file SKILL.md yang ditemukan di repositori ini." };
    }

    const candidates = await Promise.all(
      filtered.slice(0, 10).map(async (file) => {
        try {
          const content = await fetchFileContent(
            parsed.owner,
            parsed.repo,
            file.path,
            branch
          );
          const candidate = parseSkillCandidate(
            file.path,
            file.sha,
            content,
            repoInfo.licenseSpdx,
            repoInfo.repo
          );
          return {
            path: candidate.path,
            sha: candidate.sha,
            name: candidate.name,
            description: candidate.description,
            content: candidate.rawContent,
            isPermissive: candidate.isPermissive,
            licenseSpdx: candidate.licenseSpdx,
          } satisfies GitHubFormCandidate;
        } catch {
          return null;
        }
      })
    );

    return {
      repo,
      candidates: candidates.filter(
        (candidate): candidate is GitHubFormCandidate => candidate !== null
      ),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal memindai repositori GitHub.",
    };
  }
}
