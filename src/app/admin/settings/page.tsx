import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFeatureFlags, getSidebarSelectedPromptIds, getAllPublishedPromptsList } from "@/db/queries";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const [initialFlags, initialSidebarPromptIds, availablePrompts] = await Promise.all([
    getFeatureFlags(),
    getSidebarSelectedPromptIds(),
    getAllPublishedPromptsList(),
  ]);

  return (
    <SettingsClient
      initialFlags={initialFlags}
      initialSidebarPromptIds={initialSidebarPromptIds}
      availablePrompts={availablePrompts}
    />
  );
}
