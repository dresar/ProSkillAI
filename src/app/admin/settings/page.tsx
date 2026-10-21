import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  await requireAdmin();

  const found = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "feature_flags"))
    .limit(1);

  const initialFlags = (found[0]?.value as Record<string, boolean>) || {};

  return <SettingsClient initialFlags={initialFlags} />;
}
