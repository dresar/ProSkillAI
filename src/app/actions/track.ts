"use server";

import { incrementSkillCopy, incrementSkillDownload, incrementPromptCopy } from "@/db/queries";

export async function trackSkillAction(skillId: string, actionType: "copy" | "download") {
  try {
    if (actionType === "copy") {
      await incrementSkillCopy(skillId);
    } else {
      await incrementSkillDownload(skillId);
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function trackPromptAction(promptId: string) {
  try {
    await incrementPromptCopy(promptId);
    return { success: true };
  } catch {
    return { success: false };
  }
}
