"use server";

import { db } from "@/db";
import { feedbacks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateFeedbackStatusAction(id: string, status: string) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return { error: "Akses ditolak. Hanya administrator atau editor yang dapat memperbarui status umpan balik." };
  }

  await db
    .update(feedbacks)
    .set({ status })
    .where(eq(feedbacks.id, id));

  revalidatePath("/admin/feedback");
  return { success: true };
}

export async function deleteFeedbackAction(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { error: "Hanya administrator yang dapat menghapus umpan balik." };
  }

  await db.delete(feedbacks).where(eq(feedbacks.id, id));

  revalidatePath("/admin/feedback");
  return { success: true };
}
