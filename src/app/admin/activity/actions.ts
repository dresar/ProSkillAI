"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function deleteActivityLogAction(id: string) {
  await requireAdmin();

  await db.delete(auditLog).where(eq(auditLog.id, id));
  revalidatePath("/admin/activity");
  return { success: true };
}

export async function clearOldActivityLogsAction(days = 30) {
  await requireAdmin();

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  await db.delete(auditLog).where(sql`${auditLog.createdAt} < ${cutoff}`);
  revalidatePath("/admin/activity");
  return { success: true };
}
