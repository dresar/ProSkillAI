"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { settings, auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function updateFeatureFlagsAction(flags: Record<string, boolean>) {
  const admin = await requireAdmin();

  await db
    .update(settings)
    .set({
      value: flags,
      updatedAt: new Date(),
    })
    .where(eq(settings.key, "feature_flags"));

  await db.insert(auditLog).values({
    id: `audit-${Date.now()}`,
    userId: admin.id,
    userEmail: admin.email,
    action: "UPDATE_FEATURE_FLAGS",
    entityType: "settings",
    entityId: "feature_flags",
    details: flags,
    createdAt: new Date(),
  });

  revalidatePath("/");
  revalidatePath("/id");
  revalidatePath("/en");
  revalidatePath("/admin/settings");

  return { success: true };
}
