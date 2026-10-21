import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFeatureFlags } from "@/db/queries";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/admin");
  }

  const initialFlags = await getFeatureFlags();

  return <SettingsClient initialFlags={initialFlags} />;
}
