import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { feedbacks } from "@/db/schema";
import { desc } from "drizzle-orm";
import { FeedbackClient } from "./feedback-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Umpan Balik Pengguna — Admin ProSkillAI",
};

export default async function AdminFeedbackPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const allFeedbacks = await db
    .select()
    .from(feedbacks)
    .orderBy(desc(feedbacks.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Umpan Balik Pengguna
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Daftar masukan, laporan kendala teknis, dan permintaan skill dari pengguna website.
          </p>
        </div>
      </div>

      <FeedbackClient initialFeedbacks={allFeedbacks} userRole={user.role} />
    </div>
  );
}
