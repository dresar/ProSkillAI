import type {
  ShareAspectRatio,
  ShareItemData,
  SharePalette,
  ShareTheme,
  ShareUserAttribution,
} from "@/types/share";
import {
  extractOwnerAndRepo,
  getCurrentDomain,
} from "@/lib/share-utils";

export async function fetchShareCardBlob(
  item: ShareItemData,
  options?: {
    userAttribution?: ShareUserAttribution;
    domain?: string;
    width?: number;
    height?: number;
  }
): Promise<Blob> {
  const { owner, repo, title } = extractOwnerAndRepo(item);
  const displayDomain = options?.domain || getCurrentDomain();

  const params = new URLSearchParams();
  params.set("owner", owner);
  params.set("repo", repo);
  params.set("title", title);
  if (item.description) {
    params.set("description", item.description);
  }

  let stars = "555.7k";
  let forks = "52k";
  let rank = "#1";

  if (item.stats && item.stats.length > 0) {
    const starStat = item.stats.find((s) => /star|cop/i.test(s.label));
    if (starStat) stars = String(starStat.value);

    const forkStat = item.stats.find((s) => /fork|var|file/i.test(s.label));
    if (forkStat) forks = String(forkStat.value);

    const rankStat = item.stats.find((s) => /rank/i.test(s.label));
    if (rankStat) rank = String(rankStat.value);
  }

  params.set("stars", stars);
  params.set("forks", forks);
  params.set("rank", rank);

  if (options?.userAttribution?.show && options.userAttribution.username) {
    params.set("username", options.userAttribution.username);
  }

  params.set("domain", displayDomain);
  params.set("w", String(options?.width || 2400));
  params.set("h", String(options?.height || 1350));

  const res = await fetch(`/api/og?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to generate share image: ${res.statusText}`);
  }
  return res.blob();
}

export async function generateShareCardBlob(
  item: ShareItemData,
  _theme?: ShareTheme,
  _palette?: SharePalette,
  _aspectRatio?: ShareAspectRatio,
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<Blob> {
  return fetchShareCardBlob(item, {
    userAttribution,
    domain,
    width: 2400,
    height: 1350,
  });
}

export async function downloadShareCardImage(
  item: ShareItemData,
  _theme?: ShareTheme,
  _palette?: SharePalette,
  _aspectRatio?: ShareAspectRatio,
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<void> {
  const blob = await fetchShareCardBlob(item, {
    userAttribution,
    domain,
    width: 2400,
    height: 1350,
  });

  const { owner, repo } = extractOwnerAndRepo(item);
  const cleanOwner = owner.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const cleanRepo = repo.toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const filename = `proskillai-${cleanOwner}-${cleanRepo}.png`;

  const blobUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
}

export async function copyShareCardImage(
  item: ShareItemData,
  _theme?: ShareTheme,
  _palette?: SharePalette,
  _aspectRatio?: ShareAspectRatio,
  userAttribution?: ShareUserAttribution,
  domain?: string
): Promise<boolean> {
  try {
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      return false;
    }
    const blob = await fetchShareCardBlob(item, {
      userAttribution,
      domain,
      width: 1200,
      height: 675,
    });
    const itemData = new ClipboardItem({ "image/png": blob });
    await navigator.clipboard.write([itemData]);
    return true;
  } catch {
    return false;
  }
}
