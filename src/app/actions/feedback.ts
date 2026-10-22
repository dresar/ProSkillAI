"use server";

import { z } from "zod";
import { db } from "@/db";
import { feedbacks } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const feedbackSchema = z.object({
  category: z.string().min(1).default("general"),
  message: z.string().min(3, "Pesan umpan balik minimal 3 karakter"),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  url: z.string().optional(),
});

export async function submitFeedbackAction(
  _prevState: unknown,
  formData: FormData
) {
  const category = (formData.get("category") as string) || "general";
  const message = (formData.get("message") as string) || "";
  const userName = (formData.get("userName") as string) || "";
  const userEmail = (formData.get("userEmail") as string) || "";
  const url = (formData.get("url") as string) || "";

  const parsed = feedbackSchema.safeParse({
    category,
    message,
    userName,
    userEmail,
    url,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message || "Input tidak valid",
    };
  }

  const currentUser = await getCurrentUser();
  const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  await db.insert(feedbacks).values({
    id: feedbackId,
    userId: currentUser?.id || null,
    userName: userName.trim() || currentUser?.name || null,
    userEmail: userEmail.trim() || currentUser?.email || null,
    category: parsed.data.category,
    message: parsed.data.message.trim(),
    url: parsed.data.url?.trim() || null,
    status: "unread",
  });

  revalidatePath("/admin/feedback");
  return { success: true };
}
